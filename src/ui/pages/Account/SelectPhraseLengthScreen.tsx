import { Button, Column, Content, Header, Layout, Text } from '@/ui/components';
import { useLocation } from 'react-router-dom';

import { useNavigate } from '../MainRoute';
import { WordsType } from '../Account/CreateHDWalletScreen';

export default function SelectPhraseLengthScreen() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { isImport, fromUnlock } = state as {
    isImport: boolean;
    fromUnlock: boolean;
  };

  return (
    <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
        title={isImport ? 'Restore from mnemonics' : 'Create a new HD Wallet'}
      />
      <Content>
        <Column gap="lg">
          <Text text="Select Phrase Length" preset="regular-bold" />

          <Button
            preset="default"
            onClick={(e) => {
              navigate('CreateHDWalletScreen', { isImport: isImport, fromUnlock: fromUnlock });
            }}>
            <Text text="12 Words (Default)" size="sm" />
          </Button>

          <Button
            preset="default"
            onClick={(e) => {
              navigate('CreateHDWalletScreen', { isImport: isImport, fromUnlock: fromUnlock, wordsType: WordsType.WORDS_24 });
            }}>
            <Text text="24 Words" size="sm" />
          </Button>
        </Column>
      </Content>
    </Layout>
  );
}
