import { useState } from 'react';
import { CardPayload, CardStatus, Design } from '@lawallet/react/types';
import { Flex } from '@lawallet/ui';
import { PauseIcon, PlayIcon, Settings } from 'lucide-react';

import Card from '@/components/Card';
import SettingsSheet from '../Sheets/SettingsSheet';
import { Button } from '@/components/UI/button';

import { CardImage, ConfigCard } from './style';

export type CardProps = {
  uuid: string;
  data: { design: Design };
  config: CardPayload | undefined;
};

interface ComponentProps {
  card: CardProps;
  toggleCardStatus: (uuid: string) => void;
}

export default function Component(props: ComponentProps) {
  const { card, toggleCardStatus } = props;
  const [handleSelected, setHandleSelected] = useState(false);

  // ActionSheet
  const [showConfiguration, setShowConfiguration] = useState(false);

  const toggleShowConfig = () => {
    setShowConfiguration(!showConfiguration);
  };

  return (
    <>
      <Flex justify={`${handleSelected ? 'end' : 'center'}`} align="center" gap={8}>
        <CardImage onClick={() => setHandleSelected(!handleSelected)} $isActive={handleSelected}>
          <Card data={card.data} active={card.config?.status === CardStatus.ENABLED} />
        </CardImage>

        {handleSelected && (
          <ConfigCard $isActive={handleSelected}>
            <Flex direction="column" flex={1} justify="center" gap={8}>
              {card.config?.status === CardStatus.ENABLED ? (
                <div>
                  <Button size="icon" variant="destructive" onClick={() => toggleCardStatus(card.uuid)}>
                    <PauseIcon className="size-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button size="icon" onClick={() => toggleCardStatus(card.uuid)}>
                    <PlayIcon className="size-4" />
                  </Button>
                </div>
              )}
              <div>
                <Button size="icon" variant="secondary" onClick={toggleShowConfig}>
                  <Settings className="size-4" />
                </Button>
              </div>
            </Flex>
          </ConfigCard>
        )}
      </Flex>

      {/* Menu actions by Card */}
      <SettingsSheet card={card} isOpen={showConfiguration} onClose={toggleShowConfig} />
    </>
  );
}
