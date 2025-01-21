import { type VNode } from 'vue';
import { sanitizeHtml } from '~/helpers/sanitize';

export const vSanitizeHtml = {
    beforeMount(el: HTMLElement, binding: Record<string, string>, _vnode: VNode, _prevVnode: VNode | null) {
        // The el object in the parameters is passed as a pointer so changing
        // it's properties will work properly.
        // eslint-disable-next-line no-param-reassign
        el.innerHTML = sanitizeHtml(binding.value);
    },
    beforeUpdate(el: HTMLElement, binding: Record<string, string>, _vnode: VNode, _prevVnode: VNode | null) {
        // The el object in the parameters is passed as a pointer so changing
        // it's properties will work properly.
        // eslint-disable-next-line no-param-reassign
        el.innerHTML = sanitizeHtml(binding.value);
    },
};

export default vSanitizeHtml;
