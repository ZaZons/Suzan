module.exports = {
	async checkMod(member) {
		try {
			if(member.id === member.guild.ownerId) return true;			
			const connection = await require('./db.js');
			const sql = `SELECT * FROM mod_roles WHERE guildId = ${member.guild.id}`;
			let modRoles = [];
			let isMod = false;

			await connection.query(sql).then(result => {
				for(let i = 0; i < result[0].length; i++) {
					modRoles[i] = result[0][i].id;
				}
			}).catch(err => console.log(err));
			if(modRoles == '') {
				return true;
			} else {
				modRoles.forEach(role => {
					if(member.roles.cache.has(role)) isMod = true;
				});
				return isMod;
			}
		} catch (err) {
			console.log(err);
		}
	},
};