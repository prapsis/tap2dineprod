import { createContext, useState } from "react";
import { TModalKeys } from "../modals/data";
import { TModalDataMap } from "../types/modal.types";

type TModalState = {
  [key in TModalKeys]: {
    open: boolean;
    initiatorName?: string;
    data?: TModalDataMap[key] | undefined;
  };
};

type TModalContext = {
  modals: TModalState;
  openModal: <K extends TModalKeys>(params: TOpenModal<K>) => void;
  closeModal: (key: TModalKeys) => void;
};

type TOpenModal<K extends TModalKeys> = {
  key: K;
  initiatorName?: string;
  data?: TModalDataMap[K];
};

export const ModalContext = createContext<TModalContext | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<TModalState>({} as TModalState);

  const openModal = <K extends TModalKeys>({
    key,
    initiatorName,
    data,
  }: TOpenModal<K>) => {
    setModals((prev) => ({
      ...prev,
      [key]: {
        open: true,
        initiatorName,
        data,
      },
    }));
  };

  const closeModal = (key: TModalKeys) => {
    setModals((prev) => ({
      ...prev,
      [key]: {
        open: false,
        initiatorName: undefined,
        data: undefined,
      },
    }));
  };
  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
