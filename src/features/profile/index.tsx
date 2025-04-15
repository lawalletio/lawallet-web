'use client';

// Packages
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useBadges, useIdentity, useProfile } from '@lawallet/react';
import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons';

// Libs and hooks
import { cn } from '@/lib/utils';

// Generic components
import { Skeleton } from '@/components/UI/skeleton';
import { Switch } from '@/components/UI/switch';

// Internal components
import { DrawerEditProfile } from './components/drawer-edit-profile';
import { Website } from './components/website';
import { About } from './components/about';

// type BadgeRarity = 'rare' | 'super' | 'epic' | 'legendary';

// const colorRarity = {
//   rare: '#00ff00',
//   super: '#5159F7',
//   epic: '#E303E0',
//   legendary: '#E56103',
// };

export function Profile(props: { pubkey: string }) {
  const { pubkey } = props;

  const [showPendingBadges, setShowPendingBadges] = useState(false);
  const paramPubkey = useMemo(() => pubkey as string, [pubkey]);

  const identity = useIdentity();
  const profile = paramPubkey === identity.pubkey ? useProfile() : useProfile({ pubkey: paramPubkey });
  console.log(profile, 'profile');

  const { userBadges, acceptBadge, revokeBadge } =
    paramPubkey === identity.pubkey ? useBadges() : useBadges({ pubkey: paramPubkey });

  const NoBadgesMessage = ({ isPending }: { isPending: boolean }) => (
    <div className="text-center py-8">
      <p className="text-lg font-semibold text-muted-foreground">
        {isPending ? 'There are no pending badges' : 'No badges :('}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {isPending ? 'Complete more actions to unlock new badges.' : 'This account has no active badges.'}
      </p>
    </div>
  );

  return (
    <>
      <div className="relative overflow-hidden w-full max-w-[700px] h-[200px] mx-auto md:rounded-xl">
        {profile?.nip05 && profile?.nip05?.banner ? (
          <Image fill priority quality={70} className="object-cover" src={profile?.nip05?.banner} alt="Banner" />
        ) : (
          <Skeleton className="w-full h-48 rounded-none" />
        )}
      </div>

      <div className="w-full max-w-[450px] mx-auto mb-4 px-4">
        <div className="mx-auto">
          <div className="relative flex justify-between items-end w-full">
            <div className="overflow-hidden inline-flex w-auto mt-[-40px] border-4 border-background rounded-full bg-card">
              <div
                className={cn(`relative overflow-hidden flex-none bg-background rounded-full`, 'w-16 h-16 max-h-16')}
              >
                {!profile?.nip05Avatar || !profile.domainAvatar ? (
                  <Skeleton className={`w-full h-full bg-border`} />
                ) : (
                  <Image
                    fill
                    priority
                    quality={70}
                    className="object-cover"
                    src={profile?.nip05?.image || profile.domainAvatar}
                    alt={
                      profile?.nip05?.name || profile?.nip05?.displayName || String(profile?.nip05?.display_name) || ''
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {paramPubkey === identity.pubkey && <DrawerEditProfile />}

              {/* TO-DO */}
              {/* Integrate or delete Follow button */}
              {/* {paramPubkey !== identity.pubkey && <Button size="sm">Follow</Button>} */}
            </div>
          </div>
          <div className="mt-2">
            {profile?.nip05 ? (
              <p className="text-lg font-bold">
                {profile?.nip05?.name || profile?.nip05?.displayName || profile?.nip05?.display_name}
              </p>
            ) : (
              <Skeleton className="w-full h-8" />
            )}
            {/* TO-DO */}
            {/* Replace with: lud16/nip05 */}
            <p className="text-md text-muted-foreground">{identity?.lud16 ? identity?.lud16 : profile?.nip05?.name}</p>
            <div className="flex flex-col gap-1 mt-2 text-md">
              <About value={profile?.nip05?.about} />
              <Website value={profile?.nip05?.website} />
              {/* TO-DO */}
              {/* Replace with: lud16/nip05 */}
              {/* <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {shortDate(profile?.nip05?.created_at)}
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
              {paramPubkey === identity.pubkey && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Show Pending</span>
                  <Switch checked={showPendingBadges} onCheckedChange={setShowPendingBadges} />
                </div>
              )}
            </div>
            {showPendingBadges && userBadges.pendings.length === 0 ? (
              <NoBadgesMessage isPending={true} />
            ) : !showPendingBadges && userBadges.accepted.length === 0 ? (
              <NoBadgesMessage isPending={false} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                {(showPendingBadges ? userBadges.pendings : userBadges.accepted).map((badge) => {
                  return (
                    <div
                      key={badge?.id}
                      className="overflow-hidden group relative flex flex-col bg-card border-[1px] border-card rounded-xl"
                    >
                      <div className="relative w-full max-w-full transition-transform group-hover:scale-105 aspect-square">
                        {badge?.image ? (
                          <Image className="object-cover object-center" src={badge?.image} alt={badge?.name} fill />
                        ) : (
                          <Skeleton className={`w-full min-h-[130px] h-full bg-border`} />
                        )}
                        <span
                          className={cn(
                            `absolute top-1 left-1 w-[10px] h-[10px] rounded-full`,
                            `bg-[${badge?.awardEventId}]`,
                          )}
                        />
                      </div>
                      <div className="w-full h-full p-2">
                        <p className="overflow-hidden text-sm font-bold truncate">{badge?.name}</p>
                      </div>
                      {/* Action */}
                      {paramPubkey === identity.pubkey && (
                        <div className="absolute top-2 right-2 flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showPendingBadges ? acceptBadge(badge?.awardEventId) : revokeBadge(badge?.awardEventId);
                            }}
                            className="p-1 bg-background rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                          >
                            {showPendingBadges ? (
                              <EyeOpenIcon className="w-4 h-4" />
                            ) : (
                              <EyeNoneIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
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
