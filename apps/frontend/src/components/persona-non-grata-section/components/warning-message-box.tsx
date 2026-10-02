export const WarningMessageBox = ({ message }: { message: string }) => (
  <div className="bg-red-900/50 border border-red-500/40 rounded-lg p-2 mb-3 -rotate-1">
    <p
      className="text-base md:text-lg font-semibold text-red-100 animate-pulse"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  </div>
);
