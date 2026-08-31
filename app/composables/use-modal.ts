import type { Component } from "vue";

export interface ModalState {
  component: Component | null;
  props?: Record<string, any>;
}

export default function useModal() {
  const isOpen = useState<boolean>("modal-open", () => false);
  const modalContent = useState<ModalState | null>("modal-content", () => null);

  const openModal = <T extends Component>(
    component: T,
    props?: Record<string, any>,
  ) => {
    modalContent.value = {
      // markRaw prevents Vue from turning the component definition itself into a deep reactive proxy
      component: markRaw(component),
      props: props || {},
    };
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    setTimeout(() => {
      modalContent.value = null;
    }, 300);
  };

  return { isOpen, modalContent, openModal, closeModal };
}
