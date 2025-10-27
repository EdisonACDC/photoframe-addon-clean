import UploadZone from '../UploadZone';

export default function UploadZoneExample() {
  const handleFiles = (files: FileList) => {
    console.log('Files selected:', Array.from(files).map(f => f.name));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <UploadZone onFilesSelected={handleFiles} />
    </div>
  );
}
