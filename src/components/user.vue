<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryParams.query"
            placeholder="请输入搜索内容内容"
            :clearable="true"
            @clear="getuserinfos"
            @keyup.enter.native="getuserinfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getuserinfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userinfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showedit(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deluser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addclose">
        <el-form label-width="80px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formLabelAlign.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formLabelAlign.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formLabelAlign.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="formLabelAlign.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="30%">
        <el-form label-width="80px" :model="editform" ref="editref" :rules="editrulrs">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editform.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="model">
            <el-input v-model="editform.model"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edituser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getuserinfos()
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (
        !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
          value
        )
      ) {
        return callback(new Error('请输入正确手机号码'))
      }
      callback()
    }
    return {
      keyword: '',
      addDialogVisible: false,
      editdialogVisible: false,
      userinfos: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      },
      formLabelAlign: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editform: {
        username: '',
        email: '',
        model: ''
      },
      editrulrs: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async showedit(id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.statu !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.editform = res.data
    },
    async edituser() {
      const { data: res } = await this.$http.put(
        'users/' + this.editform.id,
        this.editform
      )
      if (res.meta.statu !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.editdialogVisible = false
      this.$message.success(res.meta.msg)
      this.getuserinfos()
    },
    deluser(id) {
      this.$confirm('确认要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getuserinfos()
        })
        .catch(() => {})
    },
    addclose() {
      this.$refs.ruleForm.resetFields()
    },
    adduser() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'users',
            this.formLabelAlign
          )
          if (res.meta.status !== 201) {
            return this.message.error(res.meta.msg)
          }
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getuserinfos()
        }
      })
    },
    async getuserinfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.queryParams.total = res.data.total
      this.userinfos = res.data.users
    },
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getuserinfos()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getuserinfos()
    }
  }
}
</script>
<style lang="less" scoped>
</style>