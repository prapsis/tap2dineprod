import React from "react";
import useModalContext from "../../hooks/useModalContext";
import { TModalKeys } from "../../modals/data";
import { TModalDataMap } from "../../types/modal.types";

type ModalTriggerProps<K extends TModalKeys> = {
  modalKey: K;
  initiatorName?: string;
  data?: TModalDataMap[K];
  children: React.ReactNode;
};

export const ModalTrigger = <K extends TModalKeys>({
  modalKey,
  initiatorName,
  data,
  children,
}: ModalTriggerProps<K>) => {
  const { openModal } = useModalContext();

  const handleClick = () => {
    openModal({ key: modalKey, initiatorName, data });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};
