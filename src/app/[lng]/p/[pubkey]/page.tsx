'use client';

import { Eye, EyeOff, Link as LinkIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/skeleton';
import { Switch } from '@/components/UI/switch';

import { DrawerEditProfile } from '@/components/profile/drawer-edit-profile';
import { useBadges, useIdentity, useProfile } from '@lawallet/react';
import { useParams } from 'next/navigation';

// type BadgeRarity = 'rare' | 'super' | 'epic' | 'legendary';

// const colorRarity = {
//   rare: '#00ff00',
//   super: '#5159F7',
//   epic: '#E303E0',
//   legendary: '#E56103',
// };

export default function Page() {
  const [showPendingBadges, setShowPendingBadges] = useState(false);

  const params = useParams();
  const identity = useIdentity();

  const paramPubkey = useMemo(() => params.pubkey as string, []);

  const profile = paramPubkey === identity.pubkey ? useProfile() : useProfile({ pubkey: paramPubkey });
  const { userBadges, acceptBadge, revokeBadge } =
    paramPubkey === identity.pubkey ? useBadges() : useBadges({ pubkey: paramPubkey });

  // const toggleBadgeStatus = (badge: BadgeType, isActive: boolean) => {
  //   if (isActive) {
  //     setActiveBadges(activeBadges.filter((b) => b.id !== badge.id));
  //     setPendingBadges([...pendingBadges, badge]);
  //   } else {
  //     setPendingBadges(pendingBadges.filter((b) => b.id !== badge.id));
  //     setActiveBadges([...activeBadges, badge]);
  //   }
  // };

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
        {profile.nip05 && profile.nip05.banner ? (
          <img src={profile.nip05.banner} alt="Banner" className="w-full h-full object-cover" />
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
              {profile.nip05Avatar ? (
                <img className="w-full h-full object-cover" src={profile.nip05Avatar} alt="Profile" />
              ) : (
                <Skeleton className="w-20 h-20 rounded-full" />
              )}
            </div>
            <div className="flex gap-1">
              {paramPubkey === identity.pubkey && <DrawerEditProfile />}

              {/* TO-DO */}
              {/* Integrate or delete Follow button */}
              {paramPubkey !== identity.pubkey && <Button size="sm">Follow</Button>}
            </div>
          </div>
          <div className="mt-2">
            {/* TO-DO */}
            {/* Replace with: name/displayName/display_name */}
            {profile.nip05 ? (
              <h1 className="text-2xl font-bold">{profile.nip05.displayName}</h1>
            ) : (
              <Skeleton className="w-full h-8" />
            )}
            {/* TO-DO */}
            {/* Replace with: lud16/nip05 */}
            <p className="text-md text-muted-foreground">{profile.nip05 ? profile.nip05.nip05 : identity.lud16}</p>
            <div className="flex flex-col gap-1 mt-2 text-md">
              {/* TO-DO */}
              {/* Replace with: about */}
              {profile.nip05 && profile.nip05.about ? (
                <p>{profile.nip05.about}</p>
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
                {profile.nip05 && profile.nip05.website ? (
                  <a href={profile.nip05.website} className="text-primary hover:underline">
                    {profile.nip05.website}
                  </a>
                ) : (
                  <Skeleton className="w-full h-4" />
                )}
              </div>
              {/* TO-DO */}
              {/* Replace with: lud16/nip05 */}
              {/* <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Joined September 2010
              </div> */}
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
                  {showPendingBadges ? `(${userBadges.pendings.length})` : `(${userBadges.accepted.length})`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show Pending</span>
                <Switch checked={showPendingBadges} onCheckedChange={setShowPendingBadges} />
              </div>
            </div>
            {/* TO-DO */}
            {/* Replace Badges */}
            {showPendingBadges && userBadges.pendings.length === 0 ? (
              <NoBadgesMessage isPending={true} />
            ) : !showPendingBadges && userBadges.accepted.length === 0 ? (
              <NoBadgesMessage isPending={false} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(showPendingBadges ? userBadges.pendings : userBadges.accepted).map((badge) => {
                  return (
                    <div key={badge.id} className="group relative flex flex-col gap-2 p-3 bg-card rounded-2xl">
                      <button
                        onClick={() => null}
                        className="relative w-full max-w-full transition-transform group-hover:scale-105"
                      >
                        <img src={badge.image} alt={badge.name} className="w-full rounded-lg" />
                        <span
                          className={cn(
                            `absolute top-1 left-1 w-[10px] h-[10px] rounded-full`,
                            `bg-[${badge.awardEventId}]`,
                          )}
                        />
                      </button>
                      <div className="w-full">
                        <p className="overflow-hidden text-md font-bold truncate">{badge.name}</p>
                        <p className="overflow-hidden text-sm text-muted-foreground truncate">{badge.description}</p>
                      </div>
                      {/* Action */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // toggleBadgeStatus(badge, !showPendingBadges);
                            showPendingBadges ? acceptBadge(badge.awardEventId) : revokeBadge(badge.awardEventId);
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
