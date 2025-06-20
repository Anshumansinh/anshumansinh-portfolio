import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const counters = [
  { value: 3, suffix: '+', label: 'Projects' },
  { value: 0, suffix: '+', label: 'Clients' },
  { value: 7, suffix: '', label: 'Months Experience' },
  { value: 0, suffix: '+', label: 'Satisfied Clients' },
];
const AnimatedCounter = () => {
  const counterRef = useRef(null);
  const countersRef = useRef([]);

  useGSAP(() => {
    countersRef.current.forEach((counter, index) => {
      const numberElement = counter.querySelector('.counter-number');
      const item = counters[index];
      gsap.set(numberElement, { innerText: '0' });
      gsap.to(numberElement, {
        innerText: item.value,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: '#counter',
          start: 'top center',
        },
        onUpdate: function () {
          if (item.value % 1 !== 0) {
            numberElement.textContent = `${parseFloat(numberElement.innerText).toFixed(1)}${item.suffix}`;
          } else {
            numberElement.textContent = `${Math.floor(numberElement.innerText)}${item.suffix}`;
          }
        },
        onComplete: () => {
          numberElement.textContent = `${item.value}${item.suffix}`;
        },
      });
    });
  }, []);

  return (
    <div id="counter" ref={counterRef} className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-4-cols">
        {counters.map((item, index) => (
          <div
            key={index}
            ref={el => el && (countersRef.current[index] = el)}
            className="bg-zinc-900 rounded-lg p-10 flex flex-col justify-center"
          >
            <div className="counter-number text-white-50 text-5xl font-bold mb-2">
              0{item.suffix}
            </div>
            <div className="text-white-50 text-lg">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounter;
