from django.db.models import Q, Count, Avg
from apps.salons.models import Salon
from apps.services.models import Service
from apps.staff.models import Staff
from apps.reviews.models import Review

class SearchService:
    """Advanced search service with filtering and sorting"""
    @staticmethod
    def search_salons(query, filters=None, sort_by=None):
        queryset = Salon.objects.filter(is_active=True)

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(city__icontains=query) |
                Q(address__icontains=query) |
                Q(description__icontains=query)
            )

        # Apply filters
        if filters:
            if filters.get('city'):
                queryset = queryset.filter(city__icontains=filters['city'])

            if filters.get('min_rating'):
                queryset = queryset.annotate(
                    avg_rating=Avg('reviews__rating')
                ).filter(avg_rating__gte=filters['min_rating'])

            if filters.get('has_staff'):
                queryset = queryset.annotate(
                    staff_count=Count('staff_members')
                ).filter(staff_count__gt=0)

        # Apply sorting
        if sort_by == 'rating':
            queryset = queryset.annotate(
                avg_rating=Avg('reviews__rating')
            ).order_by('-avg_rating', 'name')
        elif sort_by == 'name':
            queryset = queryset.order_by('name')
        else:  # default: newest first
            queryset = queryset.order_by('-created_at')

        return queryset

    @staticmethod
    def get_suggestions(query, limit=5):
        """Get search suggestions for autocomplete"""
        if len(query) < 2:
            return []

        # Salon suggestions
        salons = Salon.objects.filter(
            name__icontains=query,
            is_active=True
        ).values('id', 'name', 'city')[:limit]

        # Service suggestions
        services = Service.objects.filter(
            name__icontains=query,
            is_active=True
        ).select_related('salon').values(
            'id', 'name', 'salon__name'
        )[:limit]

        suggestions = []

        for s in salons:
            suggestions.append({
                'type': 'salon',
                'id': s['id'],
                'text': s['name'],
                'subtext': s['city']
            })

        for s in services:
            suggestions.append({
                'type': 'service',
                'id': s['id'],
                'text': s['name'],
                'subtext': s['salon__name']
            })
        return suggestions[:limit]