import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiService } from '@/services/api';
import { CreateCategoryRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().min(1, 'La couleur est requise'),
  icon: z.string().min(1, 'L\'icône est requise'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PREDEFINED_COLORS = [
  { name: 'Bleu', value: '#3b82f6' },
  { name: 'Vert', value: '#10b981' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Jaune', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Orange', value: '#f97316' },
];

const PREDEFINED_ICONS = [
  '🏠', '🚗', '🍔', '🛒', '💰', '💳', '🎓', '🏥',
  '🎮', '✈️', '📱', '💡', '🎬', '🎵', '👕', '🎁',
  '🏋️', '📚', '🍕', '☕', '🎯', '💼', '🏖️', '🐕',
];

export function CategoryForm({ open, onOpenChange, onSuccess }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: '#3b82f6',
      icon: '💰',
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const categoryData: CreateCategoryRequest = {
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
      };

      await apiService.createCategory(categoryData);
      toast.success('Catégorie créée avec succès');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la catégorie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Catégorie</DialogTitle>
          <DialogDescription>
            Créez une nouvelle catégorie pour organiser vos transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Revenu</SelectItem>
                      <SelectItem value="EXPENSE">Dépense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icône</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input {...field} placeholder="Sélectionnez une icône" readOnly />
                      <div className="grid grid-cols-8 gap-2 p-4 border rounded-md max-h-40 overflow-y-auto">
                        {PREDEFINED_ICONS.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            className={`text-2xl p-2 rounded-md hover:bg-muted transition-colors ${
                              field.value === icon ? 'bg-primary/20 ring-2 ring-primary' : ''
                            }`}
                            onClick={() => field.onChange(icon)}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input {...field} placeholder="#000000" />
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {PREDEFINED_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-8 h-8 rounded-md border-2 ${
                              field.value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => field.onChange(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
