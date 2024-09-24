export const useCorporateValuations = () =>{
    const activeView: Ref<string> = ref('complete');

    return {
		activeView,
	};
}