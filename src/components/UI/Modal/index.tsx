'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CrossIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { Modal, ModalContent } from './style';

import { Flex, Button, Icon, Heading } from '@lawallet/ui';

interface ComponentProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function Component(props: ComponentProps) {
  const { children, isOpen, onClose, title } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal $isOpen={open}>
      <ModalContent>
        <Flex justify="end" align="center" gap={16}>
          <Flex flex={1}>
            <Heading as="h5">{title}</Heading>
          </Flex>

          <div>
            <Button size="small" variant="bezeledGray" onClick={handleClose}>
              <Icon>
                <CrossIcon />
              </Icon>
            </Button>
          </div>
        </Flex>
        {children}
      </ModalContent>
    </Modal>
  );
}
