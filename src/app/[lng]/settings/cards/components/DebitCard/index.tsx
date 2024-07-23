import { GearIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { useState } from 'react';

import Card from '@/components/Card';

import { Button, Flex } from '@lawallet/ui';
import { CardImage, ConfigCard } from './style';

import Pause from '@/components/Icons/Pause';
import Play from '@/components/Icons/Play';
import { CardPayload, CardStatus, Design } from '@lawallet/react/types';
import SettingsSheet from '../Sheets/SettingsSheet';

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
                  <Button onClick={() => toggleCardStatus(card.uuid)} color="secondary" variant="bezeled">
                    <Pause />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button onClick={() => toggleCardStatus(card.uuid)} variant="bezeled">
                    <Play />
                  </Button>
                </div>
              )}
              <div>
                <Button onClick={toggleShowConfig} variant="bezeledGray">
                  <GearIcon />
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
