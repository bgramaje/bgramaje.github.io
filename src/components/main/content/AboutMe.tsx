import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const AboutMe = () => {
    return (
        <div className="grow flex justify-end gap-12 text-justify items-center">
            <img src="IMG_0165.jpg" className="w-[270px] h-auto rounded-full filter grayscale hover:filter-none transition-all duration-300 ease-in-out" />
            <div className="flex flex-col max-w-[400px]">
                <p className="font-semibold text-xl">
                    👋 Hello, I am&nbsp;
                    <span>
                        <TypeAnimation
                            sequence={[
                                'Borja', // Types 'One'
                                2000, // Waits 1s
                                'Boria (eng. ver.)', // Deletes 'One' and types 'Two'
                                2000, // Waits 2s
                                "'boraal'", // Types 'Three' without deleting 'Two',
                                2000,
                                "'bgramaje'", // Types 'Three' without deleting 'Two',
                                2000,
                            ]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                            style={{ display: 'inline-block' }}
                        />
                    </span>
                </p>
                <p className="text-sm font-medium mt-2">
                    A Software Engineer, Full Stack Developer, tech lover and F1 enthusiastic. 
                </p>
                <p className="text-sm mt-2 font-light ">
                    Graduated in Computer Science from Universitat Politécnica de València <i>(UPV)</i> and <i>LAB</i> University of Applied Sciences.
                    Recently, also graduated from UPV in Master's Degree in Software Systems Engineering and Technology.
                </p>
                <p className="text-sm mt-2 font-light">
                    Currently working as a full-stack developer,
                    undertaking innovative projects within the European framework such as 'H2020' or Horizon Europe.
                </p>
            </div>

        </div>
    )
}

export default AboutMe