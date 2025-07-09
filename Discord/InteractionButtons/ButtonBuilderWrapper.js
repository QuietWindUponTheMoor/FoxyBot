"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonBuilderWrapper = ButtonBuilderWrapper;
const discord_js_1 = require("discord.js");
/**
 *
 * @param {Array<ButtonBuilderOptions>} buttons
 * @returns Promise<ActionRowBuilder<ButtonBuilder>>
 */
function ButtonBuilderWrapper(buttons) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the buttons
        let buttonComponents = buttons.map(btn => new discord_js_1.ButtonBuilder()
            .setCustomId(btn.customID)
            .setLabel(btn.label)
            .setStyle(btn.style));
        return new discord_js_1.ActionRowBuilder().addComponents(...buttonComponents);
    });
}
//# sourceMappingURL=ButtonBuilderWrapper.js.map