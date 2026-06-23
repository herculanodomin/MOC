import {
  Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findByUser(@Req() req: any) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread-count')
  countUnread(@Req() req: any) {
    return this.notificationsService.countUnread(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
