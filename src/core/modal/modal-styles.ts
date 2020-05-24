import { Styles } from 'react-modal'

export const modalStyles: Styles = {
  overlay: {
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 508,
    minHeight: 411,
    position: 'static',
    boxShadow: '0 0 18px 0 #000000',
    backgroundColor: '#232323',
    border: 'none',
    padding: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'unset',
  },
}
