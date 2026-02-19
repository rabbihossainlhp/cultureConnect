import React from 'react';

const Community = () => {
    return (
        <div className="communityHero  bg-purple-100 w-full min-h-50 flex justify-between px-10 py-8">
            <div className=' h-40 flex flex-col justify-center  '>
                <h1 className='text-xl font-bold'>Connect The World-Wide Community in a minuite</h1>
                <p className='font-bold'>You Can Find your expected <br /> Community with us</p>
            </div>

            <div className='w-2/3 h-full overflow-hidden rounded-full'>
                <img src="../../../public/images/hero_world_map.jpg" alt="Community Image"   width={1000}/>
            </div>
        </div>
    );
};

export default Community;