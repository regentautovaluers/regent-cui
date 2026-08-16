const useAuthorityLetter = () => {
  const { post } = useStandardizedApi();

  const rawData = reactive({
    regNo: "",
    cName: "",
    cphone: "",
    prefferedBranch: "",
    extraInfo: "",
    policyNumber: "",
    agentOrCorporate: "",
    authorizedById: "",
  });
  const submittingRequest = ref(false);

  function submitForm() {
    try {
      submittingRequest.value = true;
    } catch (err) {
      
    } finally {
      submittingRequest.value = false;
    }

    console.log(
      "Submit Authority Letter Form Invoked with props: " +
        JSON.stringify(rawData, null, 2),
    );
  }

  return {
    rawData,
    submitForm,
    submittingRequest,
  };
};

export default useAuthorityLetter;
