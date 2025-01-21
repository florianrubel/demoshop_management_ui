import { ref } from 'vue';

export default function useEditable(
    loadFunction: CallableFunction,
) {
    const showCreate = ref<boolean>(false);
    const showEditFor = ref<string | null | undefined>(null);

    function hideCreateEdit(loadData?: boolean) {
        showCreate.value = false;
        showEditFor.value = null;
        if (loadData) {
            loadFunction();
        }
    }

    return {
        showCreate,
        showEditFor,

        hideCreateEdit,
    };
}
