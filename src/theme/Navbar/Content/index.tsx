import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {
  ErrorCauseBoundary,
  ThemeClassNames,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import {ArrowTipIcon} from '@site/src/components/icons';

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, index) => (
        <ErrorCauseBoundary
          key={index}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.\n${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  return (
    <div className="navbar__inner lr-navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items lr-navbar__items',
        )}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
        <NavbarItems items={leftItems} />
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right lr-navbar__items lr-navbar__items--right',
        )}>
        <NavbarItems items={rightItems} />
        <Link className="lr-nav-cta" to="/subscribe">
          <span>Get updates</span>
          <ArrowTipIcon width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}
