import { Tabs, Tooltip } from 'antd';
import { CSSProperties, useEffect, useMemo, useState } from 'react';

import { AddressFlagType, KEYRING_TYPE } from '@/shared/constant';
import { TokenBalance, NetworkType, Inscription } from '@/shared/types';
import { checkAddressFlag } from '@/shared/utils';
import { Card, Column, Content, Footer, Header, Icon, Layout, Row, Text } from '@/ui/components';
import AccountSelect from '@/ui/components/AccountSelect';
import { useTools } from '@/ui/components/ActionComponent';
import { AddressBar } from '@/ui/components/AddressBar';
import AtomicalsFeatureButton from '@/ui/components/AtomicalsFeatureButton';
import BRC20BalanceCard from '@/ui/components/BRC20BalanceCard';
import { Button } from '@/ui/components/Button';
import { Empty } from '@/ui/components/Empty';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { NoticePopover } from '@/ui/components/NoticePopover';
import { Pagination } from '@/ui/components/Pagination';
import { TabBar } from '@/ui/components/TabBar';
import { UpgradePopover } from '@/ui/components/UpgradePopover';
import { getCurrentTab } from '@/ui/features/browser/tabs';
import { useAccountBalance, useAddressSummary, useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import {
  useBlockstreamUrl,
  useNetworkType,
  useSkipVersionCallback,
  useVersionInfo,
  useWalletConfig
} from '@/ui/state/settings/hooks';
import { useAssetTabKey, useAtomicalsAssetTabKey, useOrdinalsAssetTabKey } from '@/ui/state/ui/hooks';
import { AssetTabKey, AtomicalsAssetTabKey, OrdinalsAssetTabKey, uiActions } from '@/ui/state/ui/reducer';
import { fontSizes } from '@/ui/theme/font';
import { useWallet } from '@/ui/utils';
import { LoadingOutlined } from '@ant-design/icons';

import { useNavigate } from '../MainRoute';

const $noBreakStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  wordBreak: 'keep-all'
};

export default function WalletTabScreen() {
  const navigate = useNavigate();

  const accountBalance = useAccountBalance();
  const networkType = useNetworkType();
  const isTestNetwork = networkType === NetworkType.TESTNET;

  const currentKeyring = useCurrentKeyring();
  const currentAccount = useCurrentAccount();
  const balanceValue = useMemo(() => {
    if (accountBalance.amount === '0') {
      return '--';
    } else {
      const parsedBalance = Math.round(parseFloat(accountBalance.amount) * 10000000) / 10000000;
      return parsedBalance.toString();
    }
  }, [accountBalance.amount]);

  const wallet = useWallet();
  const [connected, setConnected] = useState(false);

  const dispatch = useAppDispatch();
  const assetTabKey = useAssetTabKey();

  const skipVersion = useSkipVersionCallback();

  const walletConfig = useWalletConfig();
  const versionInfo = useVersionInfo();

  const [showSafeNotice, setShowSafeNotice] = useState(false);

  useEffect(() => {
    const run = async () => {
      const show = await wallet.getShowSafeNotice();
      setShowSafeNotice(show);

      const activeTab = await getCurrentTab();
      if (!activeTab) return;
      const site = await wallet.getCurrentConnectedSite(activeTab.id);
      if (site) {
        setConnected(site.isConnected);
      }
    };
    run();
  }, []);

  const tabItems = [
    {
      key: AssetTabKey.ORDINALS,
      label: 'Ordinals',
      children: <OrdinalsTab />
    }
    // {
    //   key: AssetTabKey.ATOMICALS,
    //   label: 'Atomicals',
    //   children: checkAddressFlag(currentAccount.flag, AddressFlagType.Is_Enable_Atomicals) ? (
    //     <AtomicalsTab />
    //   ) : (
    //     <AtomicalsFeatureButton />
    //   )
    // }
  ];

  const blockstreamUrl = useBlockstreamUrl();

  return (
    <Layout>
      <Header
        LeftComponent={
          <Column>
            {connected && (
              <Row
                itemsCenter
                onClick={() => {
                  navigate('ConnectedSitesScreen');
                }}>
                <Text text="·" color="green" size="xxl" />
                <Text text="Dapp Connected" size="xxs" />
              </Row>
            )}
          </Column>
        }
        RightComponent={
          <Card
            preset="style2"
            onClick={() => {
              navigate('SwitchKeyringScreen');
            }}>
            <Text text={currentKeyring.alianName} size="xxs" />
          </Card>
        }
      />
      <Content>
        <Column gap="xl">
          {currentKeyring.type === KEYRING_TYPE.HdKeyring && <AccountSelect />}

          {isTestNetwork && <Text text="Litecoin Testnet is used for testing." color="danger" textCenter />}

          {walletConfig.statusMessage && <Text text={walletConfig.statusMessage} color="danger" textCenter />}

          <Tooltip
            placement={'bottom'}
            title={
              <>
                <Row justifyBetween>
                  <span style={$noBreakStyle}>{'Confirmed LTC'}</span>
                  <span style={$noBreakStyle}>{` ${
                    Math.round(parseFloat(accountBalance.confirm_btc_amount) * 10000000) / 10000000
                  } LTC`}</span>
                </Row>
                <Row justifyBetween>
                  <span style={$noBreakStyle}>{'Unconfirmed LTC'}</span>
                  <span style={$noBreakStyle}>{` ${
                    Math.round(parseFloat(accountBalance.pending_btc_amount) * 10000000) / 10000000
                  } LTC`}</span>
                </Row>
                <Row justifyBetween>
                  <span style={$noBreakStyle}>{'LTC in Inscriptions'}</span>
                  <span style={$noBreakStyle}>{` ${
                    Math.round(parseFloat(accountBalance.inscription_amount) * 10000000) / 10000000
                  } LTC`}</span>
                </Row>
              </>
            }
            overlayStyle={{
              fontSize: fontSizes.xs
            }}>
            <div>
              <Text text={balanceValue + '  LTC'} preset="title-bold" textCenter size="xxxl" />
            </div>
          </Tooltip>

          <Row itemsCenter justifyCenter>
            <AddressBar />
            <Row
              style={{ marginLeft: 8 }}
              itemsCenter
              onClick={() => {
                window.open(`${blockstreamUrl}/address/${currentAccount.address}`);
              }}>
              <Text text={'View History'} size="xs" />
              <Icon icon="link" size={fontSizes.xs} />
            </Row>
          </Row>

          <Row justifyBetween>
            <Button
              text="Receive"
              preset="default"
              icon="receive"
              onClick={(e) => {
                navigate('ReceiveScreen');
              }}
              full
            />

            <Button
              text="Send"
              preset="default"
              icon="send"
              onClick={(e) => {
                navigate('TxCreateScreen');
              }}
              full
            />
            {walletConfig.moonPayEnabled && (
              <Button
                text="Buy"
                preset="default"
                icon="litecoin"
                onClick={(e) => {
                  navigate('MoonPayScreen');
                }}
                full
              />
            )}
          </Row>

          <Tabs
            size={'small'}
            defaultActiveKey={assetTabKey as unknown as string}
            activeKey={assetTabKey as unknown as string}
            items={tabItems as unknown as any[]}
            onTabClick={(key) => {
              dispatch(uiActions.updateAssetTabScreen({ assetTabKey: key as unknown as AssetTabKey }));
            }}
          />

          {/*{tabItems[assetTabKey].children}*/}
        </Column>
        {showSafeNotice && (
          <NoticePopover
            onClose={() => {
              wallet.setShowSafeNotice(false);
              setShowSafeNotice(false);
            }}
          />
        )}
        {!versionInfo.skipped && (
          <UpgradePopover
            onClose={() => {
              skipVersion(versionInfo.newVersion);
            }}
          />
        )}
      </Content>
      <Footer px="zero" py="zero">
        <NavTabBar tab="home" />
      </Footer>
    </Layout>
  );
}

function OrdinalsTab() {
  const addressSummary = useAddressSummary();
  const tabItems = [
    {
      key: OrdinalsAssetTabKey.ALL,
      label: `ALL (${addressSummary.inscriptionCount})`,
      children: <InscriptionList />
    },
    {
      key: OrdinalsAssetTabKey.BRC20,
      label: `LTC-20 (${addressSummary.brc20Count})`,
      children: <BRC20List />
    }
  ];

  const tabKey = useOrdinalsAssetTabKey();
  const dispatch = useAppDispatch();
  return (
    <Column>
      <Row justifyBetween>
        <TabBar
          defaultActiveKey={tabKey}
          activeKey={tabKey}
          items={tabItems}
          preset="style2"
          onTabClick={(key) => {
            dispatch(uiActions.updateAssetTabScreen({ ordinalsAssetTabKey: key }));
          }}
        />
      </Row>

      {tabItems[tabKey].children}
    </Column>
  );
}

function AtomicalsTab() {
  const addressSummary = useAddressSummary();
  const tabItems = [
    {
      key: AtomicalsAssetTabKey.ALL,
      label: `ALL (${addressSummary.atomicalsCount})`,
      children: (
        <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
          <Empty text="Not supported yet" />
        </Column>
      ),
      hidden: true
    },
    {
      key: AtomicalsAssetTabKey.ARC20,
      label: `ARC-20 (${addressSummary.arc20Count})`,
      children: (
        <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
          <Empty text="Not supported yet" />
        </Column>
      )
    },
    {
      key: AtomicalsAssetTabKey.OTHERS,
      label: 'Others',
      children: (
        <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
          <Empty text="Not supported yet" />
        </Column>
      )
    }
  ];

  const tabKey = useAtomicalsAssetTabKey();
  const dispatch = useAppDispatch();

  return (
    <Column>
      {!addressSummary.loading && addressSummary.atomicalsCount === 0 && addressSummary.arc20Count === 0 && (
        <AtomicalsFeatureButton />
      )}
      <Row justifyBetween>
        <TabBar
          defaultActiveKey={tabKey}
          activeKey={tabKey}
          items={tabItems}
          preset="style2"
          onTabClick={(key) => {
            dispatch(uiActions.updateAssetTabScreen({ atomicalsAssetTabKey: key }));
          }}
        />
      </Row>

      {tabItems[tabKey].children}
    </Column>
  );
}

function InscriptionList() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [total, setTotal] = useState(-1);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 100 });

  const tools = useTools();

  const fetchData = async () => {
    try {
      // tools.showLoading(true);
      const { list, total } = await wallet.getAllInscriptionList(
        currentAccount.address,
        pagination.currentPage,
        pagination.pageSize
      );
      setInscriptions(list);
      setTotal(total);
    } catch (e) {
      tools.toastError((e as Error).message);
    } finally {
      // tools.showLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  if (total === -1) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <LoadingOutlined />
      </Column>
    );
  }

  if (total === 0) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <Empty text="Empty" />
      </Column>
    );
  }

  return (
    <Column>
      <Row style={{ flexWrap: 'wrap' }} gap="lg">
        {inscriptions?.map((data, index) => (
          <InscriptionPreview
            key={index}
            data={data}
            preset="medium"
            onClick={() => {
              navigate('OrdinalsDetailScreen', { inscription: data, withSend: true });
            }}
          />
        ))}
      </Row>
      <Row justifyCenter mt="lg">
        <Pagination
          pagination={pagination}
          total={total}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
        />
      </Row>
    </Column>
  );
}

function BRC20List() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();

  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [total, setTotal] = useState(-1);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 100 });

  const tools = useTools();
  const fetchData = async () => {
    try {
      // tools.showLoading(true);
      const { list, total } = await wallet.getBRC20List(
        currentAccount.address,
        pagination.currentPage,
        pagination.pageSize
      );
      setTokens(list);
      setTotal(total);
    } catch (e) {
      tools.toastError((e as Error).message);
    } finally {
      // tools.showLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  if (total === -1) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <LoadingOutlined />
      </Column>
    );
  }

  if (total === 0) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <Empty text="Empty" />
      </Column>
    );
  }

  return (
    <Column>
      <Row style={{ flexWrap: 'wrap' }} gap="sm">
        {tokens?.map((data, index) => (
          <BRC20BalanceCard
            key={index}
            tokenBalance={data}
            onClick={() => {
              navigate('BRC20TokenScreen', { tokenBalance: data, ticker: data.ticker });
            }}
          />
        ))}
      </Row>

      <Row justifyCenter mt="lg">
        <Pagination
          pagination={pagination}
          total={total}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
        />
      </Row>
    </Column>
  );
}
