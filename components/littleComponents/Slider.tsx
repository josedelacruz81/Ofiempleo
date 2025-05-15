import { Slider as Sl } from "@nextui-org/react";

export const Slider = () => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Precio por hora</p>
      <Sl
        label
        renderValue={({children, ...props}) => (<output {...props}>
          <label  className="text-xs text-gray-500">
            {children}
          </label>
        </output>
          
        )}
        renderLabel={({children, ...props}) => (
          <label {...props} className="text-xs text-gray-500">
            {children}
            
          </label>
        )}
        step={50}
        minValue={0}
        maxValue={1000}
        defaultValue={[100, 500]}
        formatOptions={{ style: "currency", currency: "USD" }}
        className="max-w-md"
      />
    </div>
  );
};
