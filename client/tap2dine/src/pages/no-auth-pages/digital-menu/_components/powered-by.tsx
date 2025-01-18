import { HORIZONTAL_LOGO } from '../../../../constants/images'
import { X } from 'lucide-react';
import { useState } from 'react';

export default function PoweredBy() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className='fixed bottom-4 left-2 w-40 bg-background rounded-md border-2 border-primary p-2 z-50'>
      <button className="absolute top-1 right-1" onClick={() => setVisible(false)}>
        <X size={16} className='cursor-pointer'/>
      </button>
      <p className="text-xs text-stone-950 font-medium">Powered by</p>
      <img src={HORIZONTAL_LOGO} alt="logo" width={100} onClick={() => window.open("https://tap2dine.com", "_blank")} />
    </div>
  )
}

