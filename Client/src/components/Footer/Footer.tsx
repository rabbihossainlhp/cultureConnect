import React from 'react'
import { Globe,  } from 'lucide-react'

function Footer() {
  return (
    <div className=' min-h-[60vh] py-10 relative'>
      <div className='flex justify-evenly items-center'>
        <div>
          <div className='flex justify-evenly bg-pink-100 py-6 text-2xl px-6 items-center rounded-2xl'> 
            < Globe  className="text-pink-500" size={34}/>
            <h1>Culture Connect</h1>
          </div>
        </div>


        <div>
          <h1 className='text-xl'><strong>Culture</strong></h1>
          <ul>
            <li>Contact</li>
            <li>Home</li>
            <li>Join around world</li>
            <li>Settings</li>
          </ul>
        </div>


        <div>
            <h1 className='text-xl'><strong>Legal</strong></h1>
            <ul>
              <li>New</li>
              <li>New</li>
              <li>New</li>
              <li>New</li>
              <li>New</li>
            </ul>
        </div>
      </div>
      <hr className='text-pink-300 w-5/6  absolute left-1/2 -translate-x-1/2' />
      <div className='px-30 font-bold font-mono flex justify-between py-2 '>
        <h1>Necessary Links</h1>
        <div className='flex gap-2'>
          <h1 className=' bg-pink-300 text-white w-10 text-center py-3 px-3 rounded-full h-10'>L</h1>
          <h1 className=' bg-pink-300 text-white w-10 text-center py-3 px-3 rounded-full h-10'>I</h1>
          <h1 className=' bg-pink-300 text-white w-10 text-center py-3 px-3 rounded-full h-10'>I</h1>
          <h1 className=' bg-pink-300 text-white w-10 text-center py-3 px-3 rounded-full h-10'>I</h1>
        </div>
      </div>

      <div className='bg-pink-300 p-2 text-center absolute w-full bottom-0'> <strong>@Culture connect</strong> All Right Reseverd in 2026</div>
    </div>
  )
}

export default Footer