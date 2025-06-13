import { useEffect } from 'react';

const AdSlot = ({ provider = 'adsense', adScript = '', adHTML = '' }) => {
  useEffect(() => {
    
    if (adScript && !document.querySelector(`script[src="${adScript}"]`)) {
      const script = document.createElement('script');
      script.src = adScript;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }

    
    if (provider === 'adsense' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adScript, provider]);

  return (
    <div className="w-full my-6 flex justify-center items-center">
      <div dangerouslySetInnerHTML={{ __html: adHTML }} />
    </div>
  );
};

export default AdSlot;
