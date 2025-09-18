import { Component, OnInit, OnDestroy } from '@angular/core';
import { Register } from '../usuarios/register';
import { UserInfoService, UsuarioInfo } from '../../core/user-info.service';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Register, NgIf, NgFor, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  // ...existing code...
  saldo = 0;
  contas = [];
  lancamentos = [];
  usuario: UsuarioInfo | undefined;
  usuarioLoading = false;
  usuarioError = '';
  showUser = false;
  editMode = false;
  editUsuario: UsuarioInfo | undefined;
  editError = '';
  userServiceUpdateLoading = false;
  private routerSub?: Subscription;

  constructor(
    private userInfo: UserInfoService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}
  onShowUser() {
  console.log('[DASHBOARD] onShowUser chamado');
  this.showUser = true;
  this.editMode = false;
  this.editError = '';
  this.loadUser();
  }

  onEditUser() {
    console.log('[DASHBOARD] onEditUser chamado');
    if (this.usuario) {
      // Adiciona o campo senha preenchido com valor vazio (por segurança)
      // ou, se possível, com a senha já cadastrada (se backend retornar)
      this.editUsuario = { ...this.usuario, senha: '' };
      this.editMode = true;
      this.editError = '';
      console.log('[DASHBOARD] editUsuario:', this.editUsuario);
    }
  }

  onCancelEdit() {
    this.editMode = false;
    this.editError = '';
  }

  onSaveEdit() {
    console.log('[DASHBOARD] onSaveEdit chamado');
    if (!this.editUsuario) {
      console.warn('[DASHBOARD] editUsuario está indefinido');
      return;
    }
    if (!this.editUsuario.senha) {
      alert('A senha é obrigatória para atualizar o usuário.');
      return;
    }
    const dto: UsuarioDTO = {
      id: this.editUsuario.id,
      nome: this.editUsuario.nome,
      email: this.editUsuario.email,
      cpf: this.editUsuario.cpf,
      senha: this.editUsuario.senha,
      contasIds: [],
      centrosCustoIds: []
    };
    console.log('[DASHBOARD] Enviando update para userService.update:', dto);
    this.userServiceUpdate(dto);
  }

  private userServiceUpdate(dto: UsuarioDTO) {
    if (!dto.id) {
      console.warn('[DASHBOARD] userServiceUpdate chamado sem id');
      return;
    }
    this.userServiceUpdateLoading = true;
    console.log('[DASHBOARD] Chamando userService.update:', dto.id, dto);
    this.userService.update(dto.id, dto).subscribe({
      next: (_res: any) => {
        console.log('[DASHBOARD] Usuário atualizado com sucesso');
        this.editMode = false;
        this.editError = '';
        this.loadUser();
        this.userServiceUpdateLoading = false;
      },
      error: (err: any) => {
        console.error('[DASHBOARD] Erro ao atualizar usuário:', err);
        this.editError = 'Erro ao atualizar usuário.';
        this.userServiceUpdateLoading = false;
      }
    });
  }

  onDeleteUser() {
    console.log('[DASHBOARD] onDeleteUser chamado');
    if (!this.usuario?.id) {
      console.warn('[DASHBOARD] Não há usuario.id para excluir');
      return;
    }
    if (!confirm('Tem certeza que deseja excluir sua conta?')) {
      console.log('[DASHBOARD] Exclusão cancelada pelo usuário');
      return;
    }
    console.log('[DASHBOARD] Chamando userService.delete para id:', this.usuario.id);
    this.userService.delete(this.usuario.id).subscribe({
      next: () => {
        console.log('[DASHBOARD] Usuário excluído com sucesso, realizando logout');
        this.logout();
      },
      error: (err: any) => {
        console.error('[DASHBOARD] Erro ao excluir usuário:', err);
        this.usuarioError = 'Erro ao excluir usuário.';
      }
    });
  }

  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  ngOnInit() {
    console.log('[DASHBOARD] ngOnInit chamado');
    this.loadUser();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.startsWith('/dashboard')) {
        console.log('[DASHBOARD] NavigationEnd para dashboard, recarregando usuário');
        this.loadUser();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private loadUser(): void {
    console.log('[DASHBOARD] loadUser chamado');
    this.usuarioLoading = true;
    this.userInfo.getMe().subscribe({
      next: (user: UsuarioInfo) => {
        console.log('[DASHBOARD] Usuário carregado:', user);
        this.usuario = user;
        this.usuarioLoading = false;
      },
      error: (err: any) => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        } else {
          this.usuario = undefined;
          this.usuarioLoading = false;
          this.usuarioError = 'Erro ao carregar dados do usuário.';
          console.error('[DASHBOARD] Erro ao buscar usuário:', err);
        }
      }
    });
  }
}