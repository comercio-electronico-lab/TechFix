interface ProductGalleryProps {
  image: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10 aspect-4/3 flex items-center justify-center p-8">
        <img className="w-full h-full object-contain" src={image} alt={name} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`bg-white rounded-lg border ${i === 1 ? 'border-secondary-container' : 'border-outline-variant/20'} p-2 aspect-square cursor-pointer hover:border-secondary-container transition-colors`}>
            <img className="w-full h-full object-cover opacity-50" src={image} alt={`Vista ${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
