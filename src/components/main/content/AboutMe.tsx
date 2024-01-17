import Logo from '@/components/header/Logo';
import { TypeAnimation } from 'react-type-animation';
import Sidebar from '../Sidebar';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import ButtonAnimatedGradient from '@/components/custom/ButtonAnimatedGradient';


const AboutMe = () => {
    const url = window.location.href;

    return (
        <div className="flex justify-between items-center w-full gap-24">
            <div className="flex flex-col gap-6">
                <Logo />
                <Sidebar />
            </div>
            <div className="flex w-full gap-12 text-justify items-center">
                <img src="IMG_0165.jpg" className="w-[270px] h-auto rounded-full filter grayscale hover:filter-none transition-all duration-300 ease-in-out" />
                <div className="flex flex-col max-w-[400px]">
                    <p className="font-semibold text-xl">
                        👋 Hello, I am&nbsp;
                        <span>
                            <TypeAnimation
                                sequence={[
                                    'Borja',
                                    2000,
                                    'Boria (eng. ver.)',
                                    2000,
                                    "'boraal'",
                                    2000,
                                    "'bgramaje'",
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
                    <a href={`${window.location.href}CV_BORJA.pdf`} target='_blank'>
                        <ButtonAnimatedGradient
                            text={
                                <>
                                    <Icon
                                        icon="line-md:download-loop"
                                        fontSize="1rem"
                                        className="mr-1 hover:cursor-pointer transition-all duration-300 ease-in-out hover:text-primary-foreground"
                                    />
                                    Download CV
                                </>
                            }
                            onClick={() => console.log('caca')}
                        />
                    </a>
                </div>

            </div>
        </div>

    )
}

export default AboutMe