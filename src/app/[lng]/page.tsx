'use client';
/*
Feature: poder enviar Bitcoin onchain a una direccion de bitcoin. 
Requerimientos: Se debe utilizar la API de Boltz, la cual nos permite pedir un invoice de lightning, enviarle bitcoin por lightning y recibir el bitcoin onchain en la direccion que se le indique.
Pasos:
1- Crear una pantalla donde el usuario pueda ingresar la direccion de bitcoin onchain a la que quiere enviarle bitcoin. 
Se puede reutilizar /transfer y ermitir que reconozca y acepte las direcciones de Bitcoin on chain: bc1qdca9ukavqlya4zpk9gy9f9x6tv4keuq9l96ctq0typdkxszcgvhs544ujp
Entonces la pantalla de /transfer debiera redireccionar a /transfer/onchain en esos casos.

2- Habilitar el reconocimiento de direcciones onchain en la camara (postergar)
3- Pantalla para indicar el monto a enviar (debe consultar las tarifas de la red y mostrarlas)
4- Eviar transacion a Boltz (se debieran debitar los sats del usuario, quizas enviandolos a URLX y este lo envia a Boltz)
5- Mostrar pantalla de confirmacion
6- La transaccion debe quedar grabada para que sea listada en transactions
7- Se debe obtener un status actualizado de la transaccion (si una trx esta pendiente quien la acctualiza? ledger?)
*/
import Logo from '@/components/Logo';
import { Divider, Container, Flex, Text } from '@lawallet/ui';
import { Button } from '@/components/UI/button';

import { appTheme } from '@/config/exports';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';

export default function Page() {
  const t = useTranslations();
  const router = useRouter();

  // const { handleCreateIdentity, loading } = useCreateIdentity()
  return (
    <Container size="small">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={appTheme.colors.gray50}>
          v{process.env.version}
        </Text>
      </Flex>

      <Flex direction="column">
        {/* <Divider y={16} />

        <Flex>
          <Button
            onClick={() =>
              handleCreateIdentity({ name: '', card: '', nonce: '' })
            }
            loading={loading}
          >
            {t('CREATE_ACCOUNT')}
          </Button>
        </Flex> */}

        <Divider y={16} />

        <Button className="w-full" onClick={() => router.push('/signup')}>
          {t('CREATE_ACCOUNT')}
        </Button>
        <Divider y={8} />
        <Button className="w-full" variant="secondary" onClick={() => router.push('/login')}>
          {t('LOGIN_ACCOUNT')}
        </Button>
      </Flex>
      <Divider y={32} />
    </Container>
  );
}
