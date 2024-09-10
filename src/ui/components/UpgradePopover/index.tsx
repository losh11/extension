import { useVersionInfo } from '@/ui/state/settings/hooks';

import { Button } from '../Button';
import { Column } from '../Column';
import { Popover } from '../Popover';
import { Row } from '../Row';
import { Text } from '../Text';

export const UpgradePopover = ({ onClose }: { onClose: () => void }) => {
  const versionInfo = useVersionInfo();
  return (
    <Popover onClose={onClose}>
      <Column justifyCenter itemsCenter>
        <Column mt="lg">
          <Text preset="bold" text={`A new version (v${versionInfo.newVersion}) is available`} textCenter />
        </Column>

        <Row full mt="lg">
          <Button
            text="Skip"
            full
            onClick={(e) => {
              if (onClose) {
                onClose();
              }
            }}
          />

          <Button
            text="Go to update"
            full
            preset="primary"
            onClick={(e) => {
              window.open(versionInfo.downloadUrl);
            }}
          />
        </Row>
      </Column>
    </Popover>
  );
};
