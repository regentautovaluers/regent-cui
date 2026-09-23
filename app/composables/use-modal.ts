export default function useModal() {
  const showModal = useState<boolean>("modal-open", () => false);

  function triggerModal() {
    showModal.value = !showModal.value;
  }

  return { showModal, triggerModal };
}
