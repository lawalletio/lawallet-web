// Packages
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { NostrEvent } from 'nostr-tools';
import { Container } from '@lawallet/ui';
import { useIdentity, useNostr, useProfile } from '@lawallet/react';
import { useTranslations } from 'next-intl';

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

const DEFAULT_PROFILE = {
  kind: 0,
  content: {},
};

interface ProfileProps {
  displayName: string;
  about: string;
  website: string;
  [key: string]: string;
}

export function DrawerEditProfile() {
  const t = useTranslations();
  const { ndk } = useNostr();
  const identity = useIdentity();
  const profile = useProfile();

  const profileEvent: NostrEvent = useMemo(() => {
    const profileEvent: NostrEvent =
      profile.nip05 && profile.nip05.profileEvent ? JSON.parse(profile.nip05.profileEvent) : DEFAULT_PROFILE;

    return profileEvent;
  }, [profile]);

  const [profileContent, setProfileContent] = useState<ProfileProps>({
    displayName: '',
    about: '',
    website: '',
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = React.useCallback(async () => {
    setLoading(true);
    const newProfileEvent = {
      created_at: profile?.nip05?.created_at as number,
      content: JSON.stringify(profileContent),
      tags: profileEvent.tags,
      pubkey: identity.pubkey,
      kind: 0,
    };

    const eventToSign = new NDKEvent(ndk, newProfileEvent);

    await eventToSign.sign();
    await eventToSign.publish();

    profile.loadProfileFromPubkey(identity.pubkey);
    setOpen(false);
    setLoading(false);
  }, [profileContent, open]);

  useEffect(() => {
    const content = typeof profileEvent.content === 'string' ? JSON.parse(profileEvent.content) : profileEvent.content;
    setProfileContent(content);
  }, [profileEvent]);

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

  const t = useTranslations();

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* TO-DO */}
        {/* - Preview image */}
        {/* - Compress image */}
        {/* - Upload image */}
        {/* <div className="relative h-32 bg-muted rounded-lg overflow-hidden w-full object-cover">
          {coverPhoto ? (
            <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          <Label
            htmlFor="cover-photo"
            className="absolute top-0 lef-0 flex justify-center items-center w-full h-full bg-background/10"
          >
            <CameraIcon className="h-6 w-6 text-white" />
            <Input
              id="cover-photo"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e, setCoverPhoto)}
              accept="image/*"
            />
          </Label>
        </div> */}

        {/* TO-DO */}
        {/* - Preview image */}
        {/* - Compress image */}
        {/* - Upload image */}
        {/* <div className="overflow-hidden relative mt-[-60px] w-[80px] h-[80px] mx-4 rounded-full border-2 border-background">
          {profilePhoto ? (
            <img src={profilePhoto || '/profile.png'} alt="Profile" />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          <Label
            htmlFor="profile-photo"
            className="absolute top-0 lef-0 flex justify-center items-center w-full h-full bg-background/50"
            tabIndex={1}
          >
            <CameraIcon className="h-6 w-6 text-white" />
            <Input
              id="profile-photo"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e, setProfilePhoto)}
              accept="image/*"
            />
          </Label>
        </div> */}

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t('NAME')}</Label>
          <Input
            id="name"
            name="name"
            value={profileContent?.name || profileContent?.displayName || profileContent?.display_name}
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
            value={profileContent?.about}
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
            value={profileContent?.website}
            onChange={(e) => setProfileContent({ ...profileContent, website: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
