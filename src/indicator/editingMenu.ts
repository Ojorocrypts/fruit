import { St } from '@gi.ext';
import Indicator from './indicator';
import * as IndicatorUtils from './utils';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import CurrentMenu from './currentMenu';
import { _ } from '../translations';
import { setWidgetOrientation } from '@utils/ui';

export default class EditingMenu implements CurrentMenu {
    private readonly _indicator: Indicator;

    constructor(indicator: Indicator) {
        this._indicator = indicator;

        let boxLayout = new St.BoxLayout({
            styleClass: 'buttons-box-layout',
            xExpand: true,
            style: 'spacing: 8px',
        });
        setWidgetOrientation(boxLayout, true);

        let openMenuBtn = IndicatorUtils.createButton(
            'menu-symbolic',
            _('Menu'),
            this._indicator.path,
        );
        openMenuBtn.connect('clicked', () => this._indicator.openMenu(false));
        boxLayout.add_child(openMenuBtn);

        let infoMenuBtn = IndicatorUtils.createButton(
            'info-symbolic',
            _('Info'),
            this._indicator.path,
        );
        infoMenuBtn.connect('clicked', () => this._indicator.openMenu(true));
        boxLayout.add_child(infoMenuBtn);

        let saveBtn = IndicatorUtils.createButton(
            'save-symbolic',
            _('Save'),
            this._indicator.path,
        );
        saveBtn.connect('clicked', () => {
            this._indicator.menu.toggle();
            this._indicator.saveLayoutOnClick();
        });
        boxLayout.add_child(saveBtn);

        let cancelBtn = IndicatorUtils.createButton(
            'cancel-symbolic',
            _('Cancel'),
            this._indicator.path,
        );
        cancelBtn.connect('clicked', () => {
            this._indicator.menu.toggle();
            this._indicator.cancelLayoutOnClick();
        });
        boxLayout.add_child(cancelBtn);

        let menuItem = new PopupMenu.PopupBaseMenuItem({
            style_class: 'indicator-menu-item',
        });
        menuItem.add_child(boxLayout);

        (this._indicator.menu as PopupMenu.PopupMenu).addMenuItem(menuItem);
    }

    destroy(): void {
        (this._indicator.menu as PopupMenu.PopupMenu).removeAll();
    }
}
