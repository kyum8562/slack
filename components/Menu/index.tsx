import React, {FC, useCallback, CSSProperties} from 'react';
import {CloseModalButton, CreateMenu} from './styles';

// ts의 경우 Props의 타입을 명시해야 한다.
interface Props{
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({children, show, onCloseModal, style, closeButton}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  
  if(!show) return null;
  
  return(
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
      {children}
      </div>
    </CreateMenu>
  );

};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;