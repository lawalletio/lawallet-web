import { Container } from '@lawallet/ui';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

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
import { nowInSeconds, useIdentity, useNostr, useProfile } from '@lawallet/react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { NostrEvent } from 'nostr-tools';
// import { Skeleton } from '@/components/UI/skeleton';

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

  const handleSaveProfile = React.useCallback(async () => {
    const newProfileEvent = {
      pubkey: identity.pubkey,
      kind: 0,
      content: JSON.stringify(profileContent),
      created_at: nowInSeconds(),
      tags: profileEvent.tags,
    };

    const eventToSign = new NDKEvent(ndk, newProfileEvent);

    await eventToSign.sign();
    await eventToSign.publish();

    profile.loadProfileFromPubkey(identity.pubkey);
  }, [profileContent]);

  useEffect(() => {
    const content = typeof profileEvent.content === 'string' ? JSON.parse(profileEvent.content) : profileEvent.content;
    setProfileContent(content);
  }, [profileEvent]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="secondary">
          Edit Profile
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Container>
          <DrawerHeader className="flex justify-between items-center text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <div>
              <Button size="sm" onClick={handleSaveProfile}>
                Save
              </Button>
            </div>
          </DrawerHeader>
          <ProfileForm profileContent={profileContent} setProfileContent={setProfileContent} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </Container>
      </DrawerContent>
    </Drawer>
  );
}

interface ProfileFormProps {
  profileContent: ProfileProps;
  setProfileContent: Dispatch<SetStateAction<ProfileProps>>;
}

function ProfileForm(props: ProfileFormProps) {
  const { profileContent, setProfileContent } = props;

  const [open, setOpen] = useState(false);

  // Flow
  // const [name, setName] = useState(profile?.displayName || '');
  // const [description, setDescription] = useState(profile?.about || '');
  // const [link, setLink] = useState(profile?.website || null);
  // const [profilePhoto, setProfilePhoto] = useState(profile?.image);
  // const [coverPhoto, setCoverPhoto] = useState(profile?.banner);

  // const handleFileChange = (event: any, setPhoto: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => setPhoto(e.target.result);
  //     reader.readAsDataURL(file);
  //   }
  // };

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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={profileContent.displayName}
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={profileContent.about}
            onChange={(e) =>
              setProfileContent({
                ...profileContent,
                about: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={profileContent.website}
            onChange={(e) => setProfileContent({ ...profileContent, website: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}

function CameraIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentcolor"
      fill="none"
    >
      <path
        d="M7.00018 6.00055C5.77954 6.00421 5.10401 6.03341 4.54891 6.2664C3.77138 6.59275 3.13819 7.19558 2.76829 7.96165C2.46636 8.58693 2.41696 9.38805 2.31814 10.9903L2.1633 13.501C1.91757 17.4854 1.7947 19.4776 2.96387 20.7388C4.13303 22 6.10271 22 10.0421 22H13.9583C17.8977 22 19.8673 22 21.0365 20.7388C22.2057 19.4776 22.0828 17.4854 21.8371 13.501L21.6822 10.9903C21.5834 9.38805 21.534 8.58693 21.2321 7.96165C20.8622 7.19558 20.229 6.59275 19.4515 6.2664C18.8964 6.03341 18.2208 6.00421 17.0002 6.00055"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 7L16.1142 4.78543C15.732 3.82996 15.3994 2.7461 14.4166 2.25955C13.8924 2 13.2616 2 12 2C10.7384 2 10.1076 2 9.58335 2.25955C8.6006 2.7461 8.26801 3.82996 7.88583 4.78543L7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 14C15.5 15.933 13.933 17.5 12 17.5C10.067 17.5 8.5 15.933 8.5 14C8.5 12.067 10.067 10.5 12 10.5C13.933 10.5 15.5 12.067 15.5 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11.9998 6H12.0088" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
