import { HORIZONTAL_LOGO } from '../../../../constants/images'

export default function PoweredBy() {
  return (
    <div className='fixed bottom-4 left-2 w-40 bg-background rounded-md border-2 border-primary p-2' onClick={() => window.open("https://tap2dine.com", "_blank")}>
        <p className="text-xs text-stone-950 font-medium">Powered by Tap2Dine</p>
        <img src={HORIZONTAL_LOGO} alt="logo" />
    </div>
  )
}
