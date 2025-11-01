import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { Goal, GoalProgress, CreateGoalRequest } from '@/types/api';
import { Target, Plus, Trash2, TrendingUp, Calendar, DollarSign, Edit, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalProgress, setGoalProgress] = useState<Map<number, GoalProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [progressDialogGoal, setProgressDialogGoal] = useState<Goal | null>(null);
  const [progressAmount, setProgressAmount] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateGoalRequest>();

  const fetchGoals = async () => {
    try {
      const data = await apiService.getGoals();
      setGoals(data);

      // Fetch progress for each goal
      const progressMap = new Map<number, GoalProgress>();
      for (const goal of data) {
        try {
          const progress = await apiService.getGoalProgress(goal.id);
          progressMap.set(goal.id, progress);
        } catch (error) {
          console.error(`Error fetching progress for goal ${goal.id}:`, error);
        }
      }
      setGoalProgress(progressMap);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Erreur lors du chargement des objectifs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const onSubmit = async (data: CreateGoalRequest) => {
    try {
      if (editingGoal) {
        await apiService.updateGoal(editingGoal.id, data);
        toast.success('Objectif mis à jour avec succès');
      } else {
        await apiService.createGoal(data);
        toast.success('Objectif créé avec succès');
      }
      setIsDialogOpen(false);
      reset();
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Erreur lors de la sauvegarde de l\'objectif');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) return;

    try {
      await apiService.deleteGoal(id);
      toast.success('Objectif supprimé avec succès');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erreur lors de la suppression de l\'objectif');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setValue('name', goal.name);
    setValue('description', goal.description);
    setValue('targetAmount', goal.targetAmount);
    setValue('currentAmount', goal.currentAmount);
    setValue('targetDate', format(new Date(goal.targetDate), 'yyyy-MM-dd'));
    setValue('priority', goal.priority);
    setValue('category', goal.category);
    setIsDialogOpen(true);
  };

  const handleUpdateProgress = async () => {
    if (!progressDialogGoal || !progressAmount) return;

    try {
      await apiService.updateGoalProgress(progressDialogGoal.id, { amount: parseFloat(progressAmount) });
      toast.success('Progression mise à jour avec succès');
      setProgressDialogGoal(null);
      setProgressAmount('');
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Erreur lors de la mise à jour de la progression');
    }
  };

  const handleCompleteGoal = async (id: number) => {
    try {
      await apiService.completeGoal(id);
      toast.success('Objectif marqué comme terminé');
      fetchGoals();
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Erreur lors de la finalisation de l\'objectif');
    }
  };

  const handleCancelGoal = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet objectif ?')) return;

    try {
      await apiService.cancelGoal(id);
      toast.success('Objectif annulé');
      fetchGoals();
    } catch (error) {
      console.error('Error cancelling goal:', error);
      toast.error('Erreur lors de l\'annulation de l\'objectif');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'text-green-500';
      case 'AT_RISK': return 'text-yellow-500';
      case 'ACHIEVED': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const openNewGoalDialog = () => {
    setEditingGoal(null);
    reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Objectifs d'Épargne</h1>
            <p className="text-muted-foreground">Gérez et suivez vos objectifs financiers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewGoalDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Objectif
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}</DialogTitle>
                <DialogDescription>
                  Définissez votre objectif d'épargne avec un montant cible et une date limite
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de l'objectif</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Le nom est requis' })}
                      placeholder="Ex: Vacances d'été"
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Détails de l'objectif..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Montant cible (€)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        step="0.01"
                        {...register('targetAmount', { required: 'Le montant est requis', min: 0 })}
                      />
                      {errors.targetAmount && <span className="text-sm text-red-500">{errors.targetAmount.message}</span>}
                    </div>

                    <div>
                      <Label htmlFor="currentAmount">Montant actuel (€)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        step="0.01"
                        defaultValue="0"
                        {...register('currentAmount', { min: 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetDate">Date limite</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      {...register('targetDate', { required: 'La date est requise' })}
                    />
                    {errors.targetDate && <span className="text-sm text-red-500">{errors.targetDate.message}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue="MEDIUM">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Basse</SelectItem>
                          <SelectItem value="MEDIUM">Moyenne</SelectItem>
                          <SelectItem value="HIGH">Haute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Input
                        id="category"
                        {...register('category', { required: 'La catégorie est requise' })}
                        placeholder="Ex: Voyage"
                      />
                      {errors.category && <span className="text-sm text-red-500">{errors.category.message}</span>}
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingGoal ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Actifs</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Complétés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total à Économiser</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeGoals.reduce((sum, g) => sum + (g.targetAmount - g.currentAmount), 0).toFixed(2)} €
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Objectifs en Cours</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal) => {
              const progress = goalProgress.get(goal.id);
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());

              return (
                <Card key={goal.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {goal.name}
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between text-sm mt-1">
                        <span>{goal.currentAmount.toFixed(2)} €</span>
                        <span>{goal.targetAmount.toFixed(2)} €</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Jours restants
                        </p>
                        <p className="font-semibold">{daysRemaining > 0 ? daysRemaining : 'Échu'} jours</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Catégorie</p>
                        <p className="font-semibold">{goal.category}</p>
                      </div>
                    </div>

                    {progress && (
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Statut:</span>
                          <span className={`text-sm font-semibold ${getProgressStatusColor(progress.status)}`}>
                            {progress.status === 'ON_TRACK' && 'Sur la bonne voie'}
                            {progress.status === 'AT_RISK' && 'À risque'}
                            {progress.status === 'ACHIEVED' && 'Objectif atteint'}
                          </span>
                        </div>
                        {progress.requiredMonthlySavings > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Épargne mensuelle requise: {progress.requiredMonthlySavings.toFixed(2)} €
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setProgressDialogGoal(goal)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Mettre à jour
                      </Button>
                      {progressPercentage >= 100 && (
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCompleteGoal(goal.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terminer
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelGoal(goal.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeGoals.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun objectif actif. Créez-en un pour commencer !</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Objectifs Complétés</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="opacity-75">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {goal.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">{goal.category}</p>
                      <p className="font-semibold">{goal.targetAmount.toFixed(2)} €</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Progress Update Dialog */}
        <Dialog open={!!progressDialogGoal} onOpenChange={() => setProgressDialogGoal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mettre à jour la progression</DialogTitle>
              <DialogDescription>
                Ajoutez le montant que vous souhaitez ajouter à votre objectif "{progressDialogGoal?.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="progressAmount">Montant à ajouter (€)</Label>
                <Input
                  id="progressAmount"
                  type="number"
                  step="0.01"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {progressDialogGoal && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p>Montant actuel: {progressDialogGoal.currentAmount.toFixed(2)} €</p>
                  <p>
                    Nouveau montant:{' '}
                    {(progressDialogGoal.currentAmount + parseFloat(progressAmount || '0')).toFixed(2)} €
                  </p>
                  <p>Objectif: {progressDialogGoal.targetAmount.toFixed(2)} €</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProgressDialogGoal(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateProgress}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
