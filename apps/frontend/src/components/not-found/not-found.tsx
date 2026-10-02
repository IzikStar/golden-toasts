import { Button } from '@/components/ui/button';
import { Card, CardContent } from '../ui/card';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FC } from 'react';

export const NotFoundPage: FC = () => {
  return (
    <div className="flex items-start justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-2xl text-center bg-sunrise-100 mt-20">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <div className="bg-red-100 text-red-600 rounded-full p-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-muted-foreground text-sm" dir='rtl'>
            אופס! הדף שחיפשת לא קיים... עוד פעם אחת ואתה פרסונה נון גרטה
            <span role="img" aria-label="emoji">
              😝
            </span>{' '}
          </p>
          <Button asChild className="mt-4">
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
