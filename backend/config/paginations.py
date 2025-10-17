from rest_framework import pagination
from rest_framework.response import Response


class PagePagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'prev': self.get_previous_link(),
                'next': self.get_next_link()
            },
            'meta': {
                'current_page': self.page.number,
                'next_page': self.get_next_page(),
                'previous_page': self.get_previous_page(),
                'last_page': self.page.paginator.num_pages,
                'from': self.page.start_index(),
                'to': self.page.end_index(),
                'total': self.page.paginator.count,
                'path': self.request.build_absolute_uri()
            },
            'data': data
        })

    def get_next_page(self):
        next_page = self.page.number + 1
        if self.page.paginator.num_pages < next_page:
            return None
        else:
            return next_page

    def get_previous_page(self):
        previous_page = self.page.number - 1
        if previous_page < 1:
            return None
        else:
            return previous_page