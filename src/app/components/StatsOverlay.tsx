import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";
import AnimatedPercent from "./AnimatedPercent";

const StatsOverlay: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center z-8 pointer-events-none">
    <div className="flex flex-col-reverse md:flex-row items-start justify-center w-full max-w-5xl mx-auto gap-8 md:gap-12 px-4 md:px-8">
      {/* Left Card */}
      <div className="flex-1 rounded-2xl shadow-lg flex flex-col items-center p-6 md:p-10 min-w-0">
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex justify-center mb-6">
            <Image src="/handshake.png" alt="Handshake" width={500} height={500} style={{objectFit: 'contain'}} />
          </div>
          <div className="w-full flex gap-4">
            <div className="flex-1 bg-black rounded-lg p-6 flex flex-col items-center justify-center min-w-0">
              <span className="text-3xl font-bold text-white"><AnimatedCounter /></span>
              <span className="text-green-400 font-semibold mt-2">In Payments</span>
            </div>
            <div className="flex-1 bg-black rounded-lg p-6 flex flex-col items-center justify-center min-w-0">
              <span className="text-3xl font-bold text-white"><AnimatedPercent /></span>
              <span className="text-green-400 font-semibold mt-2">Success Rate</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right Card */}
      <div className="flex-1 rounded-2xl flex flex-col justify-start p-6 md:p-10 min-w-0" style={{border: 'none', background: 'rgba(120,130,140,0.25)'}}>
        <h1 className="font-bold text-2xl md:text-3xl mb-4 text-black">
          Stop settling for average<br />
          <span className="glow-word">Align</span> your business with excellence
        </h1>
        <p className="text-white mb-2">
          At <span className="glow-word font-bold">Align</span> Ecommerce, we don’t just process payments—we protect your profits and power your growth. Recognized by the Las Vegas Review-Journal - Best of Las Vegas and trusted by thousands of merchants, our results speak for themselves. We’ve processed over <span className="font-bold">$1 billion</span> in payments, saving our clients millions in unnecessary fees, and we’re just getting started.
        </p>
        <p className="text-white">
          With a <span className="font-bold">99.9% success rate</span> in overturning chargebacks, our clients have peace of mind knowing they’re protected from costly, friendly fraud. Backed by advanced gateways and hundreds of integrations, we build payment solutions tailored to your business… not some cookie-cutter setup.
        </p>
      </div>
    </div>
    <style jsx>{`
      @media (max-width: 768px) {
        .flex-col.md\:flex-row {
          flex-direction: column !important;
        }
        .flex-1 {
          width: 100% !important;
          margin-bottom: 2rem;
        }
      }
    `}</style>
  </div>
);

export default StatsOverlay;
