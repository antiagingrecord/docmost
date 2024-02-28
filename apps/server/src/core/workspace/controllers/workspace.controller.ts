import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from '../services/workspace.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { DeleteWorkspaceDto } from '../dto/delete-workspace.dto';
import { UpdateWorkspaceUserRoleDto } from '../dto/update-workspace-user-role.dto';
import { RemoveWorkspaceUserDto } from '../dto/remove-workspace-user.dto';
import { AddWorkspaceUserDto } from '../dto/add-workspace-user.dto';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { User } from '../../user/entities/user.entity';
import { CurrentWorkspace } from '../../../decorators/current-workspace.decorator';
import { Workspace } from '../entities/workspace.entity';
import { PaginationOptions } from '../../../helpers/pagination/pagination-options';

@UseGuards(JwtGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @AuthUser() user: User,
  ) {
    return this.workspaceService.create(user.id, createWorkspaceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update')
  async updateWorkspace(
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentWorkspace() workspace: Workspace,
  ) {
    return this.workspaceService.update(workspace.id, updateWorkspaceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('delete')
  async deleteWorkspace(@Body() deleteWorkspaceDto: DeleteWorkspaceDto) {
    return this.workspaceService.delete(deleteWorkspaceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('members')
  async getWorkspaceMembers(
    @Body()
    pagination: PaginationOptions,
    @CurrentWorkspace() workspace: Workspace,
  ) {
    return this.workspaceService.getWorkspaceUsers(workspace.id, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @Post('members/add')
  async addWorkspaceMember(
    @Body() addWorkspaceUserDto: AddWorkspaceUserDto,
    @CurrentWorkspace() workspace: Workspace,
  ) {
    return this.workspaceService.addUserToWorkspace(
      addWorkspaceUserDto.userId,
      workspace.id,
      addWorkspaceUserDto.role,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('members/delete')
  async removeWorkspaceMember(
    @Body() removeWorkspaceUserDto: RemoveWorkspaceUserDto,
    @CurrentWorkspace() workspace: Workspace,
  ) {
    return this.workspaceService.removeUserFromWorkspace(
      removeWorkspaceUserDto.userId,
      workspace.id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('members/role')
  async updateWorkspaceMemberRole(
    @Body() workspaceUserRoleDto: UpdateWorkspaceUserRoleDto,
    @CurrentWorkspace() workspace: Workspace,
  ) {
    return this.workspaceService.updateWorkspaceUserRole(
      workspaceUserRoleDto,
      workspace.id,
    );
  }
}
