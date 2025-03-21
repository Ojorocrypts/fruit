import { registerGObjectClass } from '@/utils/gjs';
import { buildRectangle, getScalingFactorOf } from '@/utils/ui';
import { Clutter, Mtk } from '@gi.ext';
import LayoutWidget from '../layout/LayoutWidget';
import Layout from '../layout/Layout';
import Tile from '../layout/Tile';
import SnapAssistTile from './snapAssistTile';

@registerGObjectClass
export default class SnapAssistLayout extends LayoutWidget<SnapAssistTile> {
    private static readonly _snapAssistHeight: number = 68;
    private static readonly _snapAssistWidth: number = 120; // 16:9 ratio. -> (16*this._snapAssistHeight) / 9 and then rounded to int

    constructor(parent: Clutter.Actor, layout: Layout, gaps: Clutter.Margin) {
        super({
            parent,
            layout,
            innerGaps: gaps.copy(),
            outerGaps: new Clutter.Margin(),
            containerRect: buildRectangle(),
            styleClass: 'snap-assist-layout',
        });

        const [, scalingFactor] = getScalingFactorOf(this);
        const width = SnapAssistLayout._snapAssistWidth * scalingFactor;
        const height = SnapAssistLayout._snapAssistHeight * scalingFactor;

        super.relayout({
            containerRect: buildRectangle({ x: 0, y: 0, width, height }),
        });
    }

    buildTile(
        parent: Clutter.Actor,
        rect: Mtk.Rectangle,
        gaps: Clutter.Margin,
        tile: Tile,
    ): SnapAssistTile {
        return new SnapAssistTile({ parent, rect, gaps, tile });
    }

    public getTileBelow(cursorPos: {
        x: number;
        y: number;
    }): SnapAssistTile | undefined {
        const [x, y] = this.get_transformed_position();

        for (let i = 0; i < this._previews.length; i++) {
            const preview = this._previews[i];
            const pos = { x: x + preview.rect.x, y: y + preview.rect.y };

            const isHovering =
                cursorPos.x >= pos.x &&
                cursorPos.x <= pos.x + preview.rect.width &&
                cursorPos.y >= pos.y &&
                cursorPos.y <= pos.y + preview.rect.height;
            if (isHovering) return preview;
        }
    }
}
