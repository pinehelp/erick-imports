import { Camera, ImagePlus, X } from 'lucide-react';
import { SimulatorData } from '@/types/simulator';
import { useRef } from 'react';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

export function StepPhotos({ data, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newUrls = Array.from(files).map(f => URL.createObjectURL(f));
    onUpdate({ photos: [...data.photos, ...newUrls] });
    // TODO: Upload to Firebase Storage instead of blob URLs
  };

  const removePhoto = (idx: number) => {
    onUpdate({ photos: data.photos.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Fotos do aparelho</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Opcional — fotos ajudam a refinar a avaliação, mas <strong className="text-foreground">não são obrigatórias</strong>
        </p>
      </div>

      {data.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {data.photos.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-8 text-muted-foreground transition-colors hover:border-brand-orange/30 hover:text-foreground active:scale-[0.98]"
      >
        <ImagePlus className="h-6 w-6" />
        <span className="text-sm font-medium">Adicionar fotos</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}
