'use client';

import { useState } from 'react';
import { Link as LinkIcon, Calendar, Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/UI/button';
import { Switch } from '@/components/UI/switch';
import Navbar from '@/components/Layout/Navbar';
import { Skeleton } from '@/components/UI/skeleton';

import { DrawerEditProfile } from '@/components/profile/drawer-edit-profile';

// type BadgeRarity = 'rare' | 'super' | 'epic' | 'legendary';

// const colorRarity = {
//   rare: '#00ff00',
//   super: '#5159F7',
//   epic: '#E303E0',
//   legendary: '#E56103',
// };

interface BadgeType {
  id: number;
  image: string;
  link: string;
  title: string;
  description: string;
  rarity: string;
  creator: string;
}

const MOCK_PROFILE = {
  banner: 'https://placehold.co/700',
  image: 'https://placehold.co/100',
  displayName: 'Jane Doe',
  about: 'Web developer, open source enthusiast, and coffee lover. Building the future, one line of code at a time. 🚀',
  website: 'janedoe.com',
};

export default function Page() {
  const [showPendingBadges, setShowPendingBadges] = useState(false);

  // MOCK DATA
  const [activeBadges, setActiveBadges] = useState<BadgeType[]>([
    {
      id: 1,
      image: 'https://placehold.co/100',
      link: 'https://example.com/badge1',
      title: 'Early Adopter',
      description: 'Awarded to users who joined in the first month',
      rarity: '',
      creator: 'Twitter Team',
    },
    {
      id: 2,
      image: 'https://placehold.co/100',
      link: 'https://example.com/badge2',
      title: 'Bug Hunter',
      description: 'Found and reported critical bugs',
      rarity: '',
      creator: 'Dev Team',
    },
    {
      id: 3,
      image: 'https://placehold.co/100',
      link: 'https://example.com/badge3',
      title: 'Top Contributor',
      description: 'Consistently provides valuable content',
      rarity: '',
      creator: 'Community Managers',
    },
  ]);

  const [pendingBadges, setPendingBadges] = useState<BadgeType[]>([
    {
      id: 4,
      image: 'https://placehold.co/100',
      link: 'https://example.com/badge4',
      title: 'Trendsetter',
      description: 'Started a viral trend',
      rarity: '',
      creator: 'Marketing Team',
    },
    {
      id: 5,
      image: 'https://placehold.co/100',
      link: 'https://example.com/badge5',
      title: 'Code Wizard',
      description: 'Contributed to open source projects',
      rarity: '',
      creator: 'Dev Community',
    },
  ]);

  const toggleBadgeStatus = (badge: BadgeType, isActive: boolean) => {
    if (isActive) {
      setActiveBadges(activeBadges.filter((b) => b.id !== badge.id));
      setPendingBadges([...pendingBadges, badge]);
    } else {
      setPendingBadges(pendingBadges.filter((b) => b.id !== badge.id));
      setActiveBadges([...activeBadges, badge]);
    }
  };

  const NoBadgesMessage = ({ isPending }: { isPending: boolean }) => (
    <div className="text-center py-8">
      <p className="text-lg font-semibold text-muted-foreground">
        {isPending ? "You don't have any pending badges." : "You haven't earned any badges yet"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {isPending
          ? 'Complete more actions to unlock new badges.'
          : 'Badges are awarded for various activities and achievements.'}
      </p>
    </div>
  );

  return (
    <>
      <Navbar showBackPage={true} overrideBack="/dashboard" />

      <div className="overflow-hidden w-full max-w-[700px] h-[200px] mx-auto md:rounded-xl">
        {/* TO-DO */}
        {/* Replace with: banner */}
        {MOCK_PROFILE.banner ? (
          <img src={MOCK_PROFILE.banner} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <Skeleton className="w-full h-48 rounded-none" />
        )}
      </div>

      <div className="w-full max-w-[450px] mx-auto px-4">
        <div className="mx-auto">
          <div className="relative flex justify-between items-end w-full">
            <div className="overflow-hidden inline-flex w-auto mt-[-40px] border-4 border-background rounded-full bg-card">
              {/* TO-DO */}
              {/* Replace with: image/avatar */}
              {MOCK_PROFILE.image ? (
                <img className="w-full h-full object-cover" src={MOCK_PROFILE.image} alt="Profile" />
              ) : (
                <Skeleton className="w-20 h-20 rounded-full" />
              )}
            </div>
            <div className="flex gap-1">
              <DrawerEditProfile />

              {/* TO-DO */}
              {/* Integrate or delete Follow button */}
              <Button size="sm">Follow</Button>
            </div>
          </div>
          <div className="mt-2">
            {/* TO-DO */}
            {/* Replace with: name/displayName/display_name */}
            {MOCK_PROFILE.displayName ? (
              <h1 className="text-2xl font-bold">{MOCK_PROFILE.displayName}</h1>
            ) : (
              <Skeleton className="w-full h-8" />
            )}
            {/* TO-DO */}
            {/* Replace with: lud16/nip05 */}
            <p className="text-md text-muted-foreground">dios@lawallet.ar</p>
            <div className="flex flex-col gap-1 mt-2 text-md">
              {/* TO-DO */}
              {/* Replace with: about */}
              {MOCK_PROFILE.about ? (
                <p>{MOCK_PROFILE.about}</p>
              ) : (
                <>
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4 mt-1" />
                </>
              )}
              {/* TO-DO */}
              {/* Replace with: website */}
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2" />
                {MOCK_PROFILE.website ? (
                  <a href={MOCK_PROFILE.website} className="text-primary hover:underline">
                    {MOCK_PROFILE.website}
                  </a>
                ) : (
                  <Skeleton className="w-full h-4" />
                )}
              </div>
              {/* TO-DO */}
              {/* Replace with: lud16/nip05 */}
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Joined September 2010
              </div>
            </div>

            {/* TO-DO */}
            {/* Integrate or delete Follow list */}
            {/* <div className="flex gap-2 text-md mt-2">
              <div>
                <span className="font-bold">1,234</span>{' '}
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
              <div>
                <span className="font-bold">5,678</span>{' '}
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
            </div> */}

            <div className="flex justify-between items-center my-4">
              <div className="flex gap-1">
                <p className="text-sm font-semibold">{showPendingBadges ? 'Pending Badges' : 'Active Badges'}</p>
                <span className="text-sm text-muted-foreground">
                  {showPendingBadges ? `(${pendingBadges.length})` : `(${activeBadges.length})`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show Pending</span>
                <Switch checked={showPendingBadges} onCheckedChange={setShowPendingBadges} />
              </div>
            </div>
            {/* TO-DO */}
            {/* Replace Badges */}
            {showPendingBadges && pendingBadges.length === 0 ? (
              <NoBadgesMessage isPending={true} />
            ) : !showPendingBadges && activeBadges.length === 0 ? (
              <NoBadgesMessage isPending={false} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(showPendingBadges ? pendingBadges : activeBadges).map((badge) => {
                  return (
                    <div key={badge.id} className="group relative flex flex-col gap-2 p-3 bg-card rounded-2xl">
                      <button
                        onClick={() => null}
                        className="relative w-full max-w-full transition-transform group-hover:scale-105"
                      >
                        <img src={badge.image} alt={badge.title} className="w-full rounded-lg" />
                        <span
                          className={cn(`absolute top-1 left-1 w-[10px] h-[10px] rounded-full`, `bg-[${badge.rarity}]`)}
                        />
                      </button>
                      <div className="w-full">
                        <p className="overflow-hidden text-md font-bold truncate">{badge.title}</p>
                        <p className="overflow-hidden text-sm text-muted-foreground truncate">{badge.description}</p>
                      </div>
                      {/* Action */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBadgeStatus(badge, !showPendingBadges);
                          }}
                          className="p-1 bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {showPendingBadges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
