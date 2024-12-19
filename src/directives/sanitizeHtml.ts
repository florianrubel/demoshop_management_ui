import { type VNode } from 'vue';
import { sanitizeHtml } from '~/helpers/sanitize';

export const vSanitizeHtml = {
    beforeMount(el: HTMLElement, binding: Record<string, string>, _vnode: VNode, _prevVnode: VNode | null) {
        el.innerHTML = sanitizeHtml(binding.value);
    },
    beforeUpdate(el: HTMLElement, binding: Record<string, string>, _vnode: VNode, _prevVnode: VNode | null) {
        el.innerHTML = sanitizeHtml(binding.value);
    },
};

export default vSanitizeHtml;
