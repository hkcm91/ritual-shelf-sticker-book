
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface PreparationStepsProps {
  form: UseFormReturn<any>;
}

const PreparationSteps: React.FC<PreparationStepsProps> = ({ form }) => {
  const steps = form.watch('steps') || [];
  
  const addStep = () => {
    const currentSteps = form.getValues('steps') || [];
    form.setValue('steps', [
      ...currentSteps,
      { id: uuidv4(), text: '' }
    ]);
  };
  
  const removeStep = (index: number) => {
    const currentSteps = [...form.getValues('steps')];
    currentSteps.splice(index, 1);
    form.setValue('steps', currentSteps);
  };
  
  const updateStep = (index: number, value: string) => {
    const currentSteps = [...form.getValues('steps')];
    currentSteps[index] = { ...currentSteps[index], text: value };
    form.setValue('steps', currentSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-amber-800">Preparation Steps</h3>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={addStep}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-amber-700">Recipe Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional notes, tips, or variations for this recipe..." 
                className="min-h-[80px] border-amber-200 focus-visible:ring-amber-500" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {steps.length === 0 ? (
        <div className="bg-amber-50 rounded-lg p-6 text-center">
          <p className="text-amber-600">No preparation steps added yet.</p>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={addStep}
            className="mt-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First Step
          </Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
          {steps.map((step: any, index: number) => (
            <div 
              key={step.id} 
              className="flex gap-3 p-4 rounded-md bg-white border border-amber-100 transition-all hover:border-amber-200 group relative"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <Textarea
                  className="border-amber-200 focus-visible:ring-amber-500 min-h-[80px]"
                  placeholder={`Step ${index + 1}: Describe what to do...`}
                  value={step.text}
                  onChange={(e) => updateStep(index, e.target.value)}
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreparationSteps;
