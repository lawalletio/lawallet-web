// Packages
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';
import { NostrEvent } from 'nostr-tools';
import { Container } from '@lawallet/ui';
import { useIdentity, useNostr, useProfile, useConfig } from '@lawallet/react';
import { useTranslations } from 'next-intl';
import { CameraIcon } from 'lucide-react';
import useAlert from '@/hooks/useAlerts';

// Generic components
import { Button } from '@/components/UI/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/UI/drawer';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Skeleton } from '@/components/UI/skeleton';

// Utils
import { compressImage } from '@/utils/imageUtils';

const DEFAULT_PROFILE = {
  kind: 0,
  content: {},
};

// Static list of relays
const PREDEFINED_RELAYS = ['wss://relay.damus.io', 'wss://relay.hodl.ar', 'wss://relay.lawallet.ar'];

interface ProfileProps {
  displayName: string;
  about: string;
  website: string;
  picture?: string;
  banner?: string;
  name?: string;
  display_name?: string;
  [key: string]: string | undefined;
}

export function DrawerEditProfile() {
  const t = useTranslations();
  const { ndk } = useNostr();
  const identity = useIdentity();
  const profile = useProfile();
  const config = useConfig();
  const { showAlert } = useAlert();

  const profileEvent: NostrEvent = useMemo(() => {
    // Validate if profile and nip05 exist
    if (!profile?.nip05 || !profile.nip05.profileEvent) {
      return DEFAULT_PROFILE;
    }

    try {
      const parsedEvent = JSON.parse(profile.nip05.profileEvent);
      return parsedEvent;
    } catch (error) {
      return DEFAULT_PROFILE;
    }
  }, [profile]);

  const [profileContent, setProfileContent] = useState<ProfileProps>({
    displayName: '',
    about: '',
    website: '',
    picture: '',
    banner: '',
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = React.useCallback(async () => {
    try {
      // Validate if we have the necessary data
      if (!ndk || !identity.pubkey) {
        showAlert({
          title: 'Error',
          description: 'Error: NDK or pubkey not available.',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      setLoading(true);

      // Create the content object that includes all the necessary fields
      const contentObj = {
        name: profileContent.name || profileContent.displayName || '',
        displayName: profileContent.displayName || profileContent.name || '',
        display_name: profileContent.display_name || profileContent.displayName || profileContent.name || '',
        about: profileContent.about || '',
        website: profileContent.website || '',
        picture: profileContent.picture || '',
        banner: profileContent.banner || '',
      };

      // Create the profile event
      const newProfileEvent = {
        created_at: Math.floor(Date.now() / 1000),
        content: JSON.stringify(contentObj),
        tags: profileEvent.tags || [],
        pubkey: identity.pubkey,
        kind: 0,
      };

      // Create and sign the event
      const eventToSign = new NDKEvent(ndk, newProfileEvent);
      await eventToSign.sign();

      // Define the relays to use
      const relays = config.relaysList && config.relaysList.length > 0 ? config.relaysList : PREDEFINED_RELAYS;

      let publishedSuccessfully = false;

      // Try to publish to each relay individually
      // This approach is less optimal but more secure for compatibility
      try {
        // First try to publish() without arguments to use default relays
        await eventToSign.publish();
        publishedSuccessfully = true;
        showAlert({
          title: 'Success',
          description: 'Your profile has been updated successfully.',
          type: 'success',
        });
      } catch (publishError) {
        showAlert({
          title: 'Error',
          description: 'Error: Your profile has not been updated.',
          type: 'error',
        });

        // If it fails, try to publish directly to the federation relay
        try {
          // Manual publication to federation relays
          for (const relay of relays) {
            try {
              // Check if the signer is available
              if (!ndk.signer) {
                showAlert({
                  title: 'Error',
                  description: 'Error: NDK signer not available.',
                  type: 'error',
                });
                continue;
              }

              // Create an explicit connection to the relay from NDK
              const tempNDK = new NDK({
                explicitRelayUrls: [relay],
                signer: ndk.signer,
              });
              await tempNDK.connect();

              // Create a new event with the same information but with this connection
              const tempEvent = new NDKEvent(tempNDK, newProfileEvent);
              await tempEvent.sign();
              await tempEvent.publish();
              showAlert({
                title: 'Success',
                description: 'Your profile has been updated successfully.',
                type: 'success',
              });
              publishedSuccessfully = true;
            } catch (relayError) {
              showAlert({
                title: 'Error',
                description: 'Error: Your profile has not been updated.',
                type: 'error',
              });
            }
          }
        } catch (error) {
          showAlert({
            title: 'Error',
            description: 'Error: Your profile has not been updated.',
            type: 'error',
          });
        }
      }

      if (publishedSuccessfully) {
        showAlert({
          title: 'Success',
          description: 'Your profile has been updated successfully.',
          type: 'success',
        });

        // Reload the profile after the successful publication
        // Wait a bit to give time for the relays to process the event
        setTimeout(async () => {
          if (profile && profile.loadProfileFromPubkey && identity.pubkey) {
            await profile.loadProfileFromPubkey(identity.pubkey);
            showAlert({
              title: 'Success',
              description: 'Your profile has been updated successfully.',
              type: 'success',
            });
          } else {
            showAlert({
              title: 'Error',
              description: 'Error: Your profile has not been updated.',
              type: 'error',
            });
          }
          setLoading(false);
          setOpen(false);
        }, 1000);
      } else {
        showAlert({
          title: 'Error',
          description: 'Error: Your profile has not been updated.',
          type: 'error',
        });
        setLoading(false);
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        description: 'Error: Your profile has not been updated.',
        type: 'error',
      });
      setLoading(false);
    }
  }, [profileContent, identity.pubkey, ndk, profile, profileEvent.tags, config.relaysList, showAlert]);

  useEffect(() => {
    if (!profile?.nip05) return;

    try {
      // Parse the content of the profile event
      const content =
        typeof profileEvent?.content === 'string' ? JSON.parse(profileEvent.content) : profileEvent.content;

      setProfileContent({
        ...content,
        displayName: content.displayName || content.name || content.display_name || '',
        name: content.name || content.displayName || content.display_name || '',
        display_name: content.display_name || content.displayName || content.name || '',
        about: content.about || '',
        website: content.website || '',
        picture: content.picture || profile?.nip05Avatar || '',
        banner: content.banner || profile?.nip05?.banner || '',
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        description: 'Error: Your profile has not been updated.',
        type: 'error',
      });
      // Set default values if there is an error
      setProfileContent({
        displayName: '',
        about: '',
        website: '',
        picture: profile?.nip05Avatar || '',
        banner: profile?.nip05?.banner || '',
      });
    }
  }, [profileEvent, profile]);

  // If there is no identity or pubkey, don't show the edit button
  if (!identity || !identity.pubkey) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="secondary">
          {t('EDIT')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Container>
          <DrawerHeader className="flex justify-between items-center text-left px-0">
            <DrawerTitle>{t('EDIT_PROFILE')}</DrawerTitle>
            <div>
              <Button size="sm" disabled={loading} onClick={handleSaveProfile}>
                {loading ? t('LOADING') : t('SAVE')}
              </Button>
            </div>
          </DrawerHeader>
          <ProfileForm profileContent={profileContent} setProfileContent={setProfileContent} />
          <DrawerFooter className="pt-2 px-0">
            <DrawerClose asChild>
              <Button variant="secondary">{t('CANCEL')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </Container>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm(props: {
  profileContent: ProfileProps;
  setProfileContent: Dispatch<SetStateAction<ProfileProps>>;
}) {
  const { profileContent, setProfileContent } = props;
  const [coverPhoto, setCoverPhoto] = useState<string | null>(profileContent.banner || null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(profileContent.picture || null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const t = useTranslations();

  // Update state when profileContent changes from parent
  useEffect(() => {
    setCoverPhoto(profileContent.banner || null);
    setProfilePhoto(profileContent.picture || null);
  }, [profileContent.banner, profileContent.picture]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    imageType: 'banner' | 'picture',
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    try {
      imageType === 'banner' ? setIsUploadingBanner(true) : setIsUploadingProfile(true);

      // Compress the image and convert to base64
      const compressedImage = await compressImage(
        file,
        imageType === 'banner' ? 0.5 : 0.3,
        imageType === 'banner' ? 1500 : 800,
        imageType === 'banner' ? 500 : 800,
      );

      // Update the image preview
      setImage(compressedImage);

      // Update the profileContent with the new image
      setProfileContent((prev) => {
        return {
          ...prev,
          [imageType]: compressedImage,
        };
      });
    } catch (error) {
      console.error('Error processing the image:', error);
    } finally {
      imageType === 'banner' ? setIsUploadingBanner(false) : setIsUploadingProfile(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Banner Image */}
        <div className="relative h-32 bg-muted rounded-lg overflow-hidden w-full object-cover">
          {isUploadingBanner ? (
            <Skeleton className="w-full h-full" />
          ) : coverPhoto ? (
            <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          <Label
            htmlFor="cover-photo"
            className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-background/10 cursor-pointer hover:bg-background/20 transition-colors"
          >
            <CameraIcon className="h-6 w-6 text-white" />
            <Input
              id="cover-photo"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e, setCoverPhoto, 'banner')}
              accept="image/*"
            />
          </Label>
        </div>

        {/* Profile Image */}
        <div className="overflow-hidden relative mt-[-60px] w-[80px] h-[80px] mx-4 rounded-full border-2 border-background">
          {isUploadingProfile ? (
            <Skeleton className="w-full h-full" />
          ) : profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          <Label
            htmlFor="profile-photo"
            className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-background/50 cursor-pointer hover:bg-background/70 transition-colors"
            tabIndex={1}
          >
            <CameraIcon className="h-6 w-6 text-white" />
            <Input
              id="profile-photo"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e, setProfilePhoto, 'picture')}
              accept="image/*"
            />
          </Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t('NAME')}</Label>
          <Input
            id="name"
            name="name"
            value={profileContent?.name || profileContent?.displayName || profileContent?.display_name || ''}
            onChange={(e) =>
              setProfileContent({
                ...profileContent,
                displayName: e.target.value,
                display_name: e.target.value,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">{t('DESCRIPTION')}</Label>
          <Textarea
            id="description"
            name="description"
            value={profileContent?.about || ''}
            onChange={(e) =>
              setProfileContent({
                ...profileContent,
                about: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="website">{t('WEBSITE')}</Label>
          <Input
            id="website"
            name="website"
            value={profileContent?.website || ''}
            onChange={(e) => setProfileContent({ ...profileContent, website: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
