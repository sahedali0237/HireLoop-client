import Image from "next/image"

export default function GlobeSection() {
  return (
    <section className="relative mx-auto aspect-1440/710 w-full max-w-360 overflow-hidden bg-black">
      {/* Original image, shifted up so only the Earth area is visible */}
      <Image
        src="/images/globe.png"
        alt="Earth globe"
        width={1440}
        height={1900} // replace with your real image height
        priority
        className="h-auto w-full"
        style={{
          marginTop: "-47.9%", // hides the purple area at the top
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
        }}
      />

      {/* Text */}
      <div className="absolute inset-x-0 bottom-[10%] z-20 text-center">
        <h2 className="text-2xl leading-snug font-medium text-white/60 md:text-3xl">
          Assisting over{" "}
          <span className="font-semibold text-white">15,000 job seekers</span>
          <br />
          find their dream positions.
        </h2>
      </div>
    </section>
  )
}
